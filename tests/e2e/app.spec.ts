import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { url: 'ru.html', locale: 'ru', initialsCount: 6, finalsCount: 3 },
  { url: 'en.html', locale: 'en', initialsCount: 6, finalsCount: 3 },
  { url: 'zh-CN.html', locale: 'zh-CN', initialsCount: 6, finalsCount: 3 }
];

async function clickEveryButtonInCurrentTab(page: Page) {
  const count = await page.locator('.group-btn').count();
  for (let i = 0; i < count; i++) {
    await page.locator('.group-btn').nth(i).click();
    await expect(page.locator('#tongue')).not.toHaveAttribute('d', '');
    await page.waitForTimeout(450);
  }
}

for (const { url, locale, initialsCount, finalsCount } of PAGES) {
  test.describe(url, () => {
    test('loads with no console/page errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(url);
      await page.waitForTimeout(300);
      expect(errors).toEqual([]);
    });

    test('initials tab shows the expected number of sound buttons', async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.group-btn')).toHaveCount(initialsCount);
    });

    test('finals tab shows the expected number of sound buttons', async ({ page }) => {
      await page.goto(url);
      await page.locator('.tab[data-tab="finals"]').click();
      await expect(page.locator('.group-btn')).toHaveCount(finalsCount);
    });

    test('the tongue shape is colored via CSS class, never inline fill/stroke (Safari regression)', async ({ page }) => {
      await page.goto(url);
      const tongue = page.locator('#tongue');
      await expect(tongue).toHaveClass(/tongue-shape/);
      await expect(tongue).not.toHaveAttribute('fill', /.+/);
      await expect(tongue).not.toHaveAttribute('stroke', /.+/);
    });

    test('clicking through every initial never errors and always renders a tongue path', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(url);
      await clickEveryButtonInCurrentTab(page);
      expect(errors).toEqual([]);
    });

    test('clicking through every final never errors and always renders a tongue path', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(url);
      await page.locator('.tab[data-tab="finals"]').click();
      await clickEveryButtonInCurrentTab(page);
      expect(errors).toEqual([]);
    });

    test('-n and -ng open the nasal airflow indicator, other sounds do not', async ({ page }) => {
      await page.goto(url);
      await page.locator('.tab[data-tab="finals"]').click();
      const buttons = page.locator('.group-btn');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const id = await btn.getAttribute('data-id');
        await btn.click();
        await page.waitForTimeout(450);
        const isOn = await page.locator('#nasalAir').evaluate((el) => el.classList.contains('on'));
        if (id === 'n' || id === 'ng') {
          expect(isOn, `expected nasal airflow ON for "${id}"`).toBe(true);
        } else {
          expect(isOn, `expected nasal airflow OFF for "${id}"`).toBe(false);
        }
      }
    });

    test('anatomy labels never overlap, at both wide and narrow viewport widths', async ({ page }) => {
      for (const width of [320, 700, 1080]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(url);

        const boxes = await page.locator('.anat-label').evaluateAll((els) =>
          els.map((el) => {
            const b = (el as unknown as SVGGraphicsElement).getBBox();
            return { text: el.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
          })
        );

        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];
            const overlap = !(
              a.x + a.w < b.x ||
              b.x + b.w < a.x ||
              a.y + a.h < b.y ||
              b.y + b.h < a.y
            );
            expect(overlap, `"${a.text}" overlaps "${b.text}" at width=${width}`).toBe(false);
          }
        }
      }
    });

    test('lips, teeth, and pharynx use readable callouts instead of sitting on anatomy lines', async ({ page }) => {
      for (const width of [320, 700, 1080]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(url);

        for (const id of ['lips', 'teeth', 'pharynx']) {
          const geometry = await page.evaluate((labelId) => {
            const label = document.querySelector(`[data-anatomy-label="${labelId}"]`) as SVGGraphicsElement | null;
            const leader = document.querySelector(`[data-anatomy-leader="${labelId}"]`) as SVGLineElement | null;
            if (!label || !leader) return null;

            const box = label.getBBox();
            const x2 = Number(leader.getAttribute('x2'));
            const y2 = Number(leader.getAttribute('y2'));
            const insideLabel =
              x2 >= box.x && x2 <= box.x + box.width &&
              y2 >= box.y && y2 <= box.y + box.height;
            const dx = x2 < box.x ? box.x - x2 : x2 > box.x + box.width ? x2 - (box.x + box.width) : 0;
            const dy = y2 < box.y ? box.y - y2 : y2 > box.y + box.height ? y2 - (box.y + box.height) : 0;
            return { text: label.textContent?.trim(), insideLabel, distance: Math.hypot(dx, dy) };
          }, id);

          expect(geometry, `${id} must have a label and a leader at width=${width}`).not.toBeNull();
          expect(geometry?.text, `${id} label must contain localized text`).toBeTruthy();
          expect(geometry?.insideLabel, `${id} leader must not run through its label at width=${width}`).toBe(false);
          expect(geometry?.distance, `${id} leader must terminate close to its label at width=${width}`).toBeLessThanOrEqual(24);
        }
      }
    });

    for (const width of [320, 1080]) {
      test(`capture review render: ${locale} anatomy diagram at ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url);
        await page.waitForTimeout(500);

        await page.locator('.diagram-card').screenshot({
          path: testInfo.outputPath(`${locale}-anatomy-${width}.png`),
          animations: 'disabled',
          caret: 'hide',
          scale: 'css'
        });
      });
    }
  });
}
