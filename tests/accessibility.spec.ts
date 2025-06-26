import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/services',
  '/booking',
  '/faq',
  '/dashboard',
  '/dashboard/admin'
] as const;

for (const page of pages) {
  test.describe(`Accessibility tests for ${page}`, () => {
    test('should not have any automatically detectable accessibility issues', async ({ page: pageObj }) => {
      await pageObj.goto(page);
      
      const accessibilityScanResults = await new AxeBuilder({ page: pageObj })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper ARIA landmarks', async ({ page: pageObj }) => {
      await pageObj.goto(page);
      
      // Check for main landmark
      const mainContent = await pageObj.locator('main');
      await expect(mainContent).toHaveCount(1);
      
      // Check for navigation landmark
      const navigation = await pageObj.locator('nav');
      await expect(navigation).toBeVisible();
      
      // Check for complementary landmarks (sidebars)
      const complementary = await pageObj.locator('[role="complementary"]');
      await expect(complementary).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page: pageObj }) => {
      await pageObj.goto(page);
      
      const headings = await pageObj.evaluate(() => {
        return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map(h => ({
            level: parseInt(h.tagName[1]),
            text: h.textContent
          }));
      });
      
      // Ensure there's exactly one h1
      const h1Count = headings.filter(h => h.level === 1).length;
      expect(h1Count).toBe(1);
      
      // Check heading hierarchy (no skipped levels)
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = headings[i].level;
        const previousLevel = headings[i-1].level;
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    });
  });
} 