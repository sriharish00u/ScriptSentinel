import { test, expect } from '@playwright/test';

test.describe('Pricing & Monetization Plans', () => {
  test('should display all 4 pricing tiers and toggle annual discount', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.locator('h1')).toContainText('Pricing');

    // Check all tier names
    await expect(page.locator('body')).toContainText('Free Starter');
    await expect(page.locator('body')).toContainText('Creator');
    await expect(page.locator('body')).toContainText('Agency');
    await expect(page.locator('body')).toContainText('Enterprise');

    // Check monthly default prices
    await expect(page.locator('body')).toContainText('$19');
    await expect(page.locator('body')).toContainText('$49');
    await expect(page.locator('body')).toContainText('$149');

    // Toggle annual billing
    const annualBtn = page.getByRole('button', { name: /Annual Billing/i });
    await annualBtn.click();

    // Check annual discounted prices
    await expect(page.locator('body')).toContainText('$15');
    await expect(page.locator('body')).toContainText('$39');
    await expect(page.locator('body')).toContainText('$119');
  });
});
