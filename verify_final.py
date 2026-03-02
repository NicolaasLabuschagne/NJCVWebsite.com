import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1200, 'height': 800})

        path = 'file://' + os.path.abspath('index.html')
        await page.goto(path)
        await asyncio.sleep(2)

        # 1. Verify Cover
        await page.screenshot(path='verification/01_cover.png')

        # 2. Flip to Hero (Image left, Text right)
        await page.click('#my-book')
        await asyncio.sleep(2)
        await page.screenshot(path='verification/02_hero_flipped.png')

        # 3. Flip to Journey (Campsite Map)
        await page.click('#my-book')
        await asyncio.sleep(2)
        await page.screenshot(path='verification/03_about_journey.png')

        # 4. Toggle Dark Mode
        await page.click('#theme-toggle')
        await asyncio.sleep(1)
        await page.screenshot(path='verification/04_dark_mode_glow.png')

        # Check for progress bar
        progress_visible = await page.is_visible('.scroll-progress-container')
        print(f"Scroll progress bar visible: {progress_visible}")

        await browser.close()

if __name__ == "__main__":
    if not os.path.exists('verification'):
        os.makedirs('verification')
    asyncio.run(verify())
