import { test, expect } from '@playwright/test';

const EXPECTED_COLORS = {
  bgPrimary: '#0A0A0A',
  bgSecondary: '#1C1C1C',
  bgTertiary: '#2A2A2A',
  textPrimary: '#F2F2F2',
  textMuted: '#A3A3A3',
  accent: '#1E3A8A'
};

test.describe('Visual Identity - Color System', () => {
  test('should use correct background colors', async ({ page }) => {
    await page.goto('/');
    
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    const hex = rgbToHex(bgColor);
    expect(hex).toBe(EXPECTED_COLORS.bgPrimary);
  });

  test('should use correct text colors', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1').first();
    const textColor = await h1.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    const hex = rgbToHex(textColor);
    expect(hex).toBe(EXPECTED_COLORS.textPrimary);
  });

  test('should use correct muted text color', async ({ page }) => {
    await page.goto('/');
    
    const muted = page.locator('.optional').first();
    const textColor = await muted.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    const hex = rgbToHex(textColor);
    expect(hex).toBe(EXPECTED_COLORS.textMuted);
  });

  test('should use correct accent color for CTAs', async ({ page }) => {
    await page.goto('/');
    
    const cta = page.locator('a.cta').first();
    const color = await cta.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    const hex = rgbToHex(color);
    expect(hex).toBe(EXPECTED_COLORS.accent);
  });
});

test.describe('Visual Identity - Typography', () => {
  test('should use serif or semi-serif for headings', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1').first();
    const fontFamily = await h1.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    
    const hasSerif = fontFamily.toLowerCase().includes('serif') || 
                     fontFamily.toLowerCase().includes('georgia') ||
                     fontFamily.toLowerCase().includes('times');
    
    expect(hasSerif).toBe(true);
  });

  test('should use sans-serif for body text', async ({ page }) => {
    await page.goto('/');
    
    const body = page.locator('body');
    const fontFamily = await body.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    
    const hasSansSerif = fontFamily.toLowerCase().includes('sans-serif') ||
                         fontFamily.toLowerCase().includes('arial') ||
                         fontFamily.toLowerCase().includes('helvetica');
    
    expect(hasSansSerif).toBe(true);
  });
});

test.describe('Visual Identity - Layout & Spacing', () => {
  test('should have proper section spacing', async ({ page }) => {
    await page.goto('/');
    
    const sections = page.locator('section, main > *');
    const sectionCount = await sections.count();
    
    expect(sectionCount).toBeGreaterThan(5);
  });

  test('should not have rounded corners (>2px)', async ({ page }) => {
    await page.goto('/');
    
    const elements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const roundedElements = [];
      
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        const radius = parseFloat(style.borderRadius);
        if (radius > 2) {
          roundedElements.push({ tag: el.tagName, radius });
        }
      }
      
      return roundedElements;
    });
    
    expect(elements.length).toBe(0);
  });

  test('should not have gradients', async ({ page }) => {
    await page.goto('/');
    
    const hasGradient = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
          return true;
        }
      }
      
      return false;
    });
    
    expect(hasGradient).toBe(false);
  });

  test('should not have shadows', async ({ page }) => {
    await page.goto('/');
    
    const hasShadow = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        if (style.boxShadow && style.boxShadow !== 'none') {
          return true;
        }
      }
      
      return false;
    });
    
    expect(hasShadow).toBe(false);
  });
});

function rgbToHex(rgb: string): string {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return rgb;
  
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}
