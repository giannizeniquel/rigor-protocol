import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing - rigor.dev', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should match hero section baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hero = page.locator('.hero');
    await expect(hero).toHaveScreenshot('hero.png', { maxDiffPixelRatio: 0.05 });
  });

  test('should match footer baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer.png', { maxDiffPixelRatio: 0.05 });
  });

  test('should match full page baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('full-page.png', { maxDiffPixelRatio: 0.05 });
  });

  test('should match structural condition section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const section = page.locator('text=Structural Acceleration').locator('xpath=../..');
    await expect(section).toHaveScreenshot('structural-condition.png', { maxDiffPixelRatio: 0.05 });
  });

  test('should match core invariants section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const section = page.locator('text=Core Invariants').locator('xpath=../..');
    await expect(section).toHaveScreenshot('core-invariants.png', { maxDiffPixelRatio: 0.05 });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('should match mobile hero baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hero = page.locator('.hero');
    await expect(hero).toHaveScreenshot('hero-mobile.png', { maxDiffPixelRatio: 0.05 });
  });

  test('should match mobile full page baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('full-page-mobile.png', { maxDiffPixelRatio: 0.05 });
  });
});
