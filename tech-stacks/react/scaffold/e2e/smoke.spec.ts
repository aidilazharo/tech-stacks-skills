import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('renders React app, serves API, and has no critical/serious accessibility violations', async ({ page, request }) => {
  const health = await request.get('/api/health');
  expect(health.ok()).toBeTruthy();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /development environment/i })).toBeVisible();
  const audit = await new AxeBuilder({ page }).analyze();
  expect(audit.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? ''))).toEqual([]);
});

test('component gallery and real API health are interactive', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Qi-inspired component library' })).toBeVisible();
  await expect(page.getByText('Core services ready')).toBeVisible();
  await page.getByRole('tab', { name: 'Forms & inputs' }).click();
  await expect(page.getByLabel('Person name')).toBeVisible();
  await page.getByRole('tab', { name: 'Data & feedback' }).click();
  await expect(page.getByRole('table')).toBeVisible();
});
test('unavailable API does not claim a connected database', async ({ page }) => {
  await page.route('**/api/health', route => route.abort());
  await page.goto('/');
  await expect(page.getByText('API verification pending')).toBeVisible();
  await expect(page.getByText('Unverified').first()).toBeVisible();
});
