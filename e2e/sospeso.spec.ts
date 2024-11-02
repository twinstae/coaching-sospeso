import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
    await page.goto('http://localhost:4321/');

    await expect(page.getByRole('heading', { name: '코칭 소스페소' })).toBeVisible();
});