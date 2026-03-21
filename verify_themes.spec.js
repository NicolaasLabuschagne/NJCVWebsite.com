const { test, expect } = require('@playwright/test');

test('Visual check of all themes', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Initial Creative theme
    await page.screenshot({ path: 'theme_creative_check.png', fullPage: true });

    // Click pet to switch to Fun theme
    await page.click('#interactive-pet');
    await page.waitForTimeout(500); // wait for animation
    await page.screenshot({ path: 'theme_fun_check.png', fullPage: true });

    // Click pet to switch to Professional theme
    await page.click('#interactive-pet');
    await page.waitForTimeout(500); // wait for animation
    await page.screenshot({ path: 'theme_professional_check.png', fullPage: true });
});
