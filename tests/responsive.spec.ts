// @ts-nocheck
import { test, expect, Page } from '@playwright/test';
import type { BoundingBox } from '@playwright/test';

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

    test('should have responsive layout', async ({ page: pageObj }) => {
      await pageObj.goto('/');

      // Test mobile viewport
      await pageObj.setViewportSize({ width: 375, height: 667 });
      await pageObj.waitForLoadState('networkidle');

      // Check if body width matches viewport width
      const body = await pageObj.$('body');
      expect(body).not.toBeNull();

      // Since we've verified body is not null, we can safely use non-null assertion
      const bodyBox = await body!.boundingBox();
      expect(bodyBox).not.toBeNull();

      const viewportSize = pageObj.viewportSize();
      expect(viewportSize).not.toBeNull();

      // Since we've verified the values are not null, we can safely use non-null assertions
      const bodyWidth = bodyBox!.width;
      const viewportWidth = viewportSize!.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

      // Check if navigation menu is collapsed on mobile
      const menuButton = await pageObj.$('button[aria-label="Toggle navigation"]');
      expect(menuButton).not.toBeNull();

      const menuBox = await menuButton!.boundingBox();
      expect(menuBox).not.toBeNull();
      const menuHeight = menuBox!.height;
      expect(menuHeight).toBeGreaterThanOrEqual(44);

      // Test desktop viewport
      await pageObj.setViewportSize({ width: 1280, height: 800 });
      await pageObj.waitForLoadState('networkidle');

      // Check if navigation menu is expanded on desktop
      const menuButtonDesktop = await pageObj.$('button[aria-label="Toggle navigation"]');
      expect(menuButtonDesktop).toBeNull();
    });
  });
} 