import { test, expect } from '@playwright/test';

test.describe('Minimalistic Auth Flow', () => {
  test('should open auth modal and allow sign in / registration', async ({ page }) => {
    await page.goto('/');

    const signUpBtn = page.getByRole('button', { name: /Sign Up/i });
    await expect(signUpBtn).toBeVisible();
    await signUpBtn.click();

    // Verify modal is open
    await expect(page.getByRole('heading', { name: /Create Free Account/i })).toBeVisible();

    // Fill form
    await page.locator('input[placeholder="Alex Rivers"]').fill('John Creator');
    await page.locator('input[placeholder="creator@brand.com"]').fill('john@creator.com');
    await page.locator('input[placeholder="••••••••"]').fill('password123');

    const submitBtn = page.getByRole('button', { name: /Get Started Free/i });
    await submitBtn.click();

    // Verify user badge in navbar
    await expect(page.locator('header')).toContainText('John Creator');
  });
});
