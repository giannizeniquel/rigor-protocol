import { test, expect } from '@playwright/test';

test.describe('E2E Navigation - rigor.dev', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RIGOR/);
  });

  test('should display hero section with correct content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toHaveText('RIGOR');
    await expect(page.locator('h2').first()).toHaveText('AI Constraint Protocol.');
    await expect(page.locator('.tertiary')).toHaveText('Formal boundaries for AI-generated systems.');
  });

  test('should have working CTA linking to docs', async ({ page }) => {
    await page.goto('/');
    
    const cta = page.locator('a.cta').first();
    await expect(cta).toHaveText('Access Specification →');
    await expect(cta).toHaveAttribute('href', 'https://docs.rigor.dev');
  });

  test('should have footer with correct links', async ({ page }) => {
    await page.goto('/');
    
    const footerSpecLink = page.locator('.footer-link').filter({ hasText: 'Specification' });
    await expect(footerSpecLink).toHaveAttribute('href', 'https://docs.rigor.dev');
    
    const footerGitHubLink = page.locator('.footer-link').filter({ hasText: 'GitHub' });
    await expect(footerGitHubLink).toHaveAttribute('href', 'https://github.com/rigor');
  });

  test('should have all main sections', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Structural Acceleration' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Structural Entropy' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AI Constraint Protocol Model' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Core Invariants' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Structural Positioning' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Conceptual Territory' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Protocol vs Prompt Engineering' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Normative Documentation' })).toBeVisible();
  });
});

test.describe('E2E Navigation - docs.rigor.dev', () => {
  test.skip(() => true, 'docs.rigor.dev is not accessible in testing environment');
  
  test('should load docs homepage', async ({ page }) => {
    await page.goto('https://docs.rigor.dev');
    await expect(page).toHaveTitle(/RIGOR/);
  });

  test('should have navigation links working', async ({ page }) => {
    await page.goto('https://docs.rigor.dev');
    
    const navLinks = page.locator('.VPNav a');
    await expect(navLinks.first()).toBeVisible();
  });
});

test.describe('Broken Links Detection', () => {
  test.skip(() => true, 'External sites not accessible in testing environment');
  
  test('should have no broken links on landing page', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    const externalLinks = [];
    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('https'))) {
        externalLinks.push(href);
      }
    }
    
    const uniqueLinks = [...new Set(externalLinks)];
    
    for (const link of uniqueLinks) {
      if (link.includes('docs.rigor.dev') || link.includes('github.com/rigor')) {
        const response = await page.request.head(link);
        expect(response.status(), `Link ${link} should be accessible`).toBeLessThan(400);
      }
    }
  });
});
