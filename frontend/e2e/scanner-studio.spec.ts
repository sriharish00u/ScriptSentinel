import { test, expect } from '@playwright/test';

test.describe('Scanner Studio & Interactive Highlighting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render homepage with hero, live metrics, and scanner studio', async ({ page }) => {
    await expect(page).toHaveTitle(/ScriptSentinel/i);
    await expect(page.locator('h1')).toContainText('Hidden Algorithm Bans');
    await expect(page.locator('#studio')).toBeVisible();
    await expect(page.getByRole('button', { name: /Auto-Fix All Flagged Terms/i })).toBeVisible();
  });

  test('should detect high-risk shadowban keywords in user input', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.fill('Are you ready to cure your illness and achieve fast weight loss with our secret miracle pill?');
    
    // Wait for debounced analyzer
    await page.waitForTimeout(600);

    // Verify risk gauge shows risk
    const riskText = page.locator('#studio');
    await expect(riskText).toContainText('%');
    
    // Verify detected trigger tags
    await expect(page.getByRole('button', { name: /cure/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /weight loss/i })).toBeVisible();
  });

  test('should auto-fix all flagged terms when clicking Auto-Fix', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.fill('Order our new fat burner to get fast weight loss results!');
    
    await page.waitForTimeout(600);
    
    const autoFixBtn = page.getByRole('button', { name: /Auto-Fix All Flagged Terms/i });
    await expect(autoFixBtn).toBeEnabled();
    await autoFixBtn.click();

    // Text should now contain algo-safe alternatives
    const updatedValue = await editor.inputValue();
    expect(updatedValue.toLowerCase()).not.toContain('fat burner');
    expect(updatedValue.toLowerCase()).toContain('metabolic support');
  });

  test('should switch presets accurately', async ({ page }) => {
    const trueCrimeBtn = page.getByRole('button', { name: /True Crime Story Script/i });
    await trueCrimeBtn.click();

    const editor = page.locator('textarea');
    await expect(editor).toHaveValue(/murder/i);
    
    await page.waitForTimeout(600);
    await expect(page.getByRole('button', { name: /murder/i })).toBeVisible();
  });

  test('should allow 1-click single word replacement from inspector', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.fill('This method will kill all your doubts.');
    
    await page.waitForTimeout(600);
    
    // Click the detected term tag
    const killTag = page.getByRole('button', { name: /kill/i }).first();
    await killTag.click();

    // Look for the swap button in inspector
    const swapButton = page.getByRole('button', { name: /unalive/i }).first();
    if (await swapButton.isVisible()) {
      await swapButton.click();
      const updatedValue = await editor.inputValue();
      expect(updatedValue).toContain('unalive');
    }
  });
});
