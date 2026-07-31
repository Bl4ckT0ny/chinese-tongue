import { test, expect, type Page, type TestInfo } from '@playwright/test';

const PAGES = [
  { url: 'ru.html', locale: 'ru' },
  { url: 'en.html', locale: 'en' }
] as const;

const TAB_NAMES = ['initials', 'finals'] as const;
const WIDTHS = [320, 700, 1080] as const;

async function selectAndWait(page: Page, buttonIndex: number): Promise<string> {
  const button = page.locator('.group-btn').nth(buttonIndex);
  const soundId = (await button.getAttribute('data-id')) ?? `index-${buttonIndex}`;
  await button.click();
  await page.waitForTimeout(450);
  return soundId;
}

async function expectTeethLabelClearOfTongue(
  page: Page,
  context: string
): Promise<void> {
  const boxes = await page.evaluate(() => {
    const label = document.querySelector('[data-anatomy-label="teeth"]') as SVGGraphicsElement | null;
    const tongue = document.querySelector('#tongue') as SVGGraphicsElement | null;
    if (!label || !tongue) return null;

    const a = label.getBBox();
    const b = tongue.getBBox();
    return {
      label: { x: a.x, y: a.y, w: a.width, h: a.height },
      tongue: { x: b.x, y: b.y, w: b.width, h: b.height }
    };
  });

  expect(boxes, `${context}: missing teeth label or tongue`).not.toBeNull();
  if (!boxes) return;

  const a = boxes.label;
  const b = boxes.tongue;
  const overlap = !(
    a.x + a.w < b.x ||
    b.x + b.w < a.x ||
    a.y + a.h < b.y ||
    b.y + b.h < a.y
  );

  expect(overlap, `${context}: teeth label overlaps tongue`).toBe(false);
}

async function captureAllStates(
  page: Page,
  testInfo: TestInfo,
  locale: string,
  width: number
): Promise<void> {
  for (const tabName of TAB_NAMES) {
    await page.locator(`.tab[data-tab="${tabName}"]`).click();
    const buttons = page.locator('.group-btn');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const soundId = await selectAndWait(page, i);
      await page.locator('.diagram-card').screenshot({
        path: testInfo.outputPath(`${locale}-${width}-${tabName}-${soundId}.png`),
        animations: 'disabled',
        caret: 'hide',
        scale: 'css'
      });
    }
  }
}

for (const { url, locale } of PAGES) {
  test.describe(`${url}: all tongue positions`, () => {
    test('teeth label stays clear for every initial and final', async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);

        for (const tabName of TAB_NAMES) {
          await page.locator(`.tab[data-tab="${tabName}"]`).click();
          const buttons = page.locator('.group-btn');
          const count = await buttons.count();

          for (let i = 0; i < count; i++) {
            const soundId = await selectAndWait(page, i);
            await expectTeethLabelClearOfTongue(
              page,
              `${locale}/${tabName}/${soundId}/width=${width}`
            );
          }
        }
      }
    });

    for (const width of [320, 1080] as const) {
      test(`capture every tongue position at ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);
        await captureAllStates(page, testInfo, locale, width);
      });
    }
  });
}
