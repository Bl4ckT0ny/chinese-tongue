import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { url: 'ru.html', initialsCount: 6, finalsCount: 3 },
  { url: 'en.html', initialsCount: 6, finalsCount: 3 }
];

async function clickEveryButtonInCurrentTab(page: Page) {
  const count = await page.locator('.group-btn').count();
  for (let i = 0; i < count; i++) {
    await page.locator('.group-btn').nth(i).click();
    // wait for the 400ms tongue animation to finish rather than a fixed sleep
    await expect(page.locator('#tongue')).not.toHaveAttribute('d', '');
    await page.waitForTimeout(450);
  }
}

for (const { url, initialsCount, finalsCount } of PAGES) {
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
      // A real bug: fill="var(--tongue)" as an XML attribute doesn't resolve
      // reliably in Safari. The color must come from the .tongue-shape class.
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
      // Regression test: automates the getBBox collision check that was
      // previously done by hand after labels were found overlapping on
      // small screens.
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
  });
}
