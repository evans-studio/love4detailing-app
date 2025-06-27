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
      
      // Check for main landmark (always present)
      const main = await pageObj.locator('main');
      await expect(main).toBeVisible();
      
      // Check for navigation landmark - look for various types
      const sidebarNav = pageObj.locator('aside nav[role="navigation"]');
      const hiddenNav = pageObj.locator('#navigation');
      const anyNav = pageObj.locator('nav[role="navigation"]');
      
      // Count all navigation elements
      const sidebarNavCount = await sidebarNav.count();
      const hiddenNavCount = await hiddenNav.count();
      const anyNavCount = await anyNav.count();
      
      // At least one navigation element should exist
      expect(sidebarNavCount + hiddenNavCount + anyNavCount).toBeGreaterThan(0);
      
      // Check for complementary landmarks (sidebars) based on page and viewport
      const viewport = pageObj.viewportSize();
      const isDashboardPage = page.includes('/dashboard');
      const isHomePage = page === '/';
      
      if (!isHomePage) {
        const complementary = pageObj.locator('[role="complementary"]');
        const complementaryCount = await complementary.count();
        
        // Should have complementary landmark when sidebar should be visible
        const shouldHaveVisibleComplementary = isDashboardPage 
          ? viewport && viewport.width >= 768  // md breakpoint for dashboard
          : viewport && viewport.width >= 1024; // lg breakpoint for others
          
        if (shouldHaveVisibleComplementary) {
          expect(complementaryCount).toBeGreaterThan(0);
          // Check if it's actually visible
          if (complementaryCount > 0) {
            await expect(complementary.first()).toBeVisible();
          }
        } else {
          // On smaller screens, complementary may be hidden - this is acceptable
          // We just need some form of navigation to exist
          expect(sidebarNavCount + hiddenNavCount + anyNavCount).toBeGreaterThan(0);
        }
      }
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