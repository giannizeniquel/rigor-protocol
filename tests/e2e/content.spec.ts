import { test, expect } from '@playwright/test';

const PROHIBITED_WORDS = [
  'fast', 'easy', 'seamless',
  'disruptive', 'revolutionary', 'cutting-edge',
  'magic', 'smart',
  'empower', 'boost', 'supercharge'
];

const EXPECTED_CONTENT = {
  hero: {
    h1: 'RIGOR',
    h2: 'AI Constraint Protocol.',
    tertiary: 'Formal boundaries for AI-generated systems.',
    optional: 'Generation requires boundaries.',
    cta: 'Access Specification →',
  },
  structuralCondition: {
    heading: 'Structural Acceleration',
    body: [
      'AI-native systems increase implementation velocity beyond human structural oversight capacity.',
      'Generation throughput now exceeds structural validation throughput.',
      'When structural change outpaces structural governance, systems accumulate implicit transitions, undeclared evolution, migration ambiguity, and contract instability.',
      'This condition produces structural entropy.'
    ]
  },
  structuralEntropy: {
    heading: 'Structural Entropy',
    definition: 'Structural Entropy is the progressive increase of implicit, unclassified, or non-deterministic structural behavior across iterative system evolution.',
    positioning: 'RIGOR positions itself as an entropy-reduction protocol.'
  },
  protocolModel: {
    heading: 'AI Constraint Protocol Model',
    diagramTitle: 'Architectural Position',
    description: 'RIGOR operates as a constraint layer between human intent and runtime execution.'
  },
  coreInvariants: {
    heading: 'Core Invariants',
    invariants: [
      { label: 'Explicitness', description: 'All transitions must be declared. No implicit behavior is permitted.' },
      { label: 'Determinism', description: 'Given state, event, and version, the resulting transition must be singular or explicitly rejected.' },
      { label: 'Classified Evolution', description: 'All structural changes must be typed as compatible, conditional, or breaking. Silent evolution is invalid.' },
      { label: 'Validation Before Execution', description: 'Structural validation is a precondition of existence. Execution without validation violates the protocol.' },
      { label: 'Separation of Layers', description: 'RIGOR formally separates language definition, specification instance, and validation engine. No layer may implicitly assume another.' }
    ]
  },
  structuralPositioning: {
    heading: 'Structural Positioning'
  },
  conceptualTerritory: {
    heading: 'Conceptual Territory',
    territory: [
      'Pre-Execution Structural Protocol',
      'AI Structural Boundedness',
      'Deterministic Evolution Governance',
      'Version-Typed Process Contracts',
      'Structural Entropy Reduction'
    ]
  },
  protocolVsPrompt: {
    heading: 'Protocol vs Prompt Engineering'
  },
  specificationAccess: {
    heading: 'Normative Documentation',
    cta: 'Access Specification →'
  },
  footer: {
    brand: 'RIGOR',
    tagline: 'AI Constraint Protocol',
    specLink: 'Specification',
    githubLink: 'GitHub',
    version: 'Specification v0.1'
  }
};

test.describe('Content Accuracy Verification', () => {
  test('hero section should match exact content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toHaveText(EXPECTED_CONTENT.hero.h1);
    await expect(page.locator('h2').first()).toHaveText(EXPECTED_CONTENT.hero.h2);
    await expect(page.locator('.tertiary')).toHaveText(EXPECTED_CONTENT.hero.tertiary);
    await expect(page.locator('.optional')).toHaveText(EXPECTED_CONTENT.hero.optional);
    await expect(page.locator('a.cta').first()).toHaveText(EXPECTED_CONTENT.hero.cta);
  });

  test('structural condition section should match exact content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Structural Acceleration' })).toBeVisible();
  });

  test('structural entropy section should match exact content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Structural Entropy' })).toBeVisible();
    await expect(page.locator('text=RIGOR positions itself as an entropy-reduction protocol.')).toBeVisible();
  });

  test('core invariants should have all five invariants', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Core Invariants' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explicitness' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Determinism' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Classified Evolution' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Validation Before Execution' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Separation of Layers' })).toBeVisible();
  });

  test('conceptual territory should have all territory items', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Conceptual Territory' })).toBeVisible();
    for (const item of EXPECTED_CONTENT.conceptualTerritory.territory) {
      await expect(page.locator(`text=${item}`).first()).toBeVisible();
    }
  });

  test('footer should match exact content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.brand')).toHaveText(EXPECTED_CONTENT.footer.brand);
    await expect(page.locator('.tagline')).toHaveText(EXPECTED_CONTENT.footer.tagline);
    await expect(page.locator('.version')).toHaveText(EXPECTED_CONTENT.footer.version);
    await expect(page.locator('.footer-link').filter({ hasText: 'Specification' })).toBeVisible();
    await expect(page.locator('.footer-link').filter({ hasText: 'GitHub' })).toBeVisible();
  });
});

test.describe('Prohibited Vocabulary Check', () => {
  test('should not contain prohibited words in visible content', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('main').innerText();
    const contentLower = bodyText.toLowerCase();
    
    const foundProhibited = PROHIBITED_WORDS.filter(word => 
      new RegExp(`\\b${word}\\b`, 'i').test(contentLower)
    );
    
    expect(foundProhibited).toHaveLength(0);
  });

  test('should not contain exclamation marks', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('body').innerText();
    const exclamationCount = (bodyText.match(/!/g) || []).length;
    
    expect(exclamationCount).toBe(0);
  });
});

test.describe('Tone and Narrative Verification', () => {
  test('should follow declarative tone - no questions', async ({ page }) => {
    await page.goto('/');
    
    const bodyText = await page.locator('body').innerText();
    const questionCount = (bodyText.match(/\?/g) || []).length;
    
    expect(questionCount).toBe(0);
  });

  test('should not contain marketing language', async ({ page }) => {
    await page.goto('/');
    
    const pageContent = await page.content();
    const marketingTerms = ['revolutionary', 'disruptive', 'game-changing', 'breakthrough'];
    
    const found = marketingTerms.filter(term => 
      pageContent.toLowerCase().includes(term.toLowerCase())
    );
    
    expect(found).toHaveLength(0);
  });
});
