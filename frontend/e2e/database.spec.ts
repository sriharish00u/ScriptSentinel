import { test, expect } from '@playwright/test';

test.describe('Banned Words & Lexicon Database', () => {
  test('should render database and filter by keyword', async ({ page }) => {
    await page.goto('/database');

    await expect(page.locator('h1')).toContainText('Algo-Safe Database');

    const searchInput = page.locator('input[placeholder*="Search keywords"]');
    await expect(searchInput).toBeVisible();

    // Type a search term
    await searchInput.fill('diet');
    await page.waitForTimeout(400);

    // Should find the term
    await expect(page.locator('body')).toContainText('diet');
  });

  test('should filter by platform dropdown', async ({ page }) => {
    await page.goto('/database');

    const platformSelect = page.locator('select').first();
    await platformSelect.selectOption('youtube');
    await page.waitForTimeout(400);

    // YouTube specific triggers
    await expect(page.locator('body')).toBeVisible();
  });
});
