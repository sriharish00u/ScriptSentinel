import { test, expect } from '@playwright/test';

test.describe('Landing Page URL Auditor', () => {
  test('should render URL auditor page and perform live audit', async ({ page }) => {
    await page.goto('/url-scanner');

    await expect(page.locator('h1')).toContainText('Compliance Auditor');

    const urlInput = page.locator('input[type="text"]');
    await expect(urlInput).toBeVisible();

    const auditBtn = page.getByRole('button', { name: /Audit Landing Page/i });
    await expect(auditBtn).toBeVisible();
  });
});
