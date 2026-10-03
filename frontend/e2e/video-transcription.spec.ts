import { test, expect } from '@playwright/test';

test.describe('In-Built Video & Audio Transcription', () => {
  test('should toggle to video transcription mode and show YouTube/Upload options', async ({ page }) => {
    await page.goto('/');

    const videoTabBtn = page.getByRole('button', { name: /In-Built Video & Audio Transcription/i });
    await expect(videoTabBtn).toBeVisible();
    await videoTabBtn.click();

    // Verify inputs appear
    await expect(page.locator('input[placeholder*="youtube.com"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Transcribe & Audit/i })).toBeVisible();
  });

  test('should run simulated video transcription and show 30-sec monetization zone', async ({ page }) => {
    await page.goto('/');

    const videoTabBtn = page.getByRole('button', { name: /In-Built Video & Audio Transcription/i });
    await videoTabBtn.click();

    const urlInput = page.locator('input[placeholder*="youtube.com"]');
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    const submitBtn = page.getByRole('button', { name: /Transcribe & Audit/i });
    await submitBtn.click();

    // Verify transcript appears with 30-sec warning
    await expect(page.locator('body')).toContainText('Synchronized Transcript');
    await expect(page.locator('body')).toContainText('30-Second Monetization Zone');
  });
});
