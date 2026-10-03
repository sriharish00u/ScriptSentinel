import { test, expect } from '@playwright/test';

test.describe('Programmatic SEO Dynamic Pages', () => {
  test('should render dynamic pSEO page for "diet" on TikTok with FAQ schema and answer', async ({ page }) => {
    await page.goto('/tiktok/banned-words/diet');

    // Check H1 and verdict
    await expect(page.locator('h1')).toContainText('Diet');
    await expect(page.locator('body')).toContainText('Algorithm Ruling');
    await expect(page.locator('body')).toContainText('Verdict:');

    // Check Safe alternatives
    await expect(page.locator('body')).toContainText('Platform Approved Safe Alternatives');

    // Check FAQ section
    await expect(page.locator('body')).toContainText('Frequently Asked Questions');

    // Check embedded scanner
    await expect(page.locator('#studio')).toBeVisible();
  });

  test('should render dynamic pSEO page for "giveaway" on Instagram/Meta', async ({ page }) => {
    await page.goto('/meta/banned-words/giveaway');

    await expect(page.locator('h1')).toContainText('Giveaway');
    await expect(page.locator('body')).toContainText('Engagement Bait');
  });
});
