import { test, expect, Page } from '@playwright/test';

const pages = [
  '/',
  '/services',
  '/booking',
  '/faq',
  '/dashboard',
  '/dashboard/admin'
] as const;

for (const page of pages) {
  test.describe(`Responsive tests for ${page}`, () => {
    test('should not have horizontal scroll', async ({ page: pageObj }: { page: Page }) => {
      await pageObj.goto(page);
      const body = await pageObj.locator('body');
      const { width: bodyWidth } = await body.boundingBox();
      const { width: viewportWidth } = pageObj.viewportSize();
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });

    test('should have minimum touch targets of 44px', async ({ page: pageObj }: { page: Page }) => {
      await pageObj.goto(page);
      const interactiveElements = await pageObj.$$('button, a, [role="button"]');
      
      for (const element of interactiveElements) {
        const box = await element.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('should maintain brand colors', async ({ page: pageObj }: { page: Page }) => {
      await pageObj.goto(page);
      const styles = await pageObj.evaluate(() => {
        const style = window.getComputedStyle(document.documentElement);
        return {
          purple: style.getPropertyValue('--purple').trim(),
          black: style.getPropertyValue('--black').trim(),
          offWhite: style.getPropertyValue('--off-white').trim(),
        };
      });
      
      expect(styles.purple).toBe('#8A2B85');
      expect(styles.black).toBe('#141414');
      expect(styles.offWhite).toBe('#F8F4EB');
    });

    test('should have proper sidebar behavior', async ({ page: pageObj, isMobile }: { page: Page, isMobile: boolean }) => {
      await pageObj.goto(page);
      if (isMobile) {
        const sidebar = await pageObj.locator('.sidebar');
        await expect(sidebar).toBeHidden();
        
        const menuButton = await pageObj.locator('.mobile-menu-button');
        await expect(menuButton).toBeVisible();
      } else {
        const sidebar = await pageObj.locator('.sidebar');
        await expect(sidebar).toBeVisible();
      }
    });
  });
} 