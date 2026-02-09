import asyncio
from playwright.async_api import async_playwright
import os

async def verify_final_redesign():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the local index.html
        path = os.path.abspath("index.html")
        await page.goto(f"file://{path}")
        await page.wait_for_timeout(2000)  # Wait for p5.js to init

        # Check for JS errors
        page.on("pageerror", lambda exc: print(f"uncaught exception: {exc}"))

        # Verify p5 canvas exists
        canvas_exists = await page.query_selector("canvas") is not None
        print(f"Canvas exists: {canvas_exists}")

        # Verify cloud-effect is gone
        cloud_effect_exists = await page.query_selector(".cloud-effect") is not None
        print(f"Cloud effect exists (should be False): {cloud_effect_exists}")

        # Take screenshot of Hero
        await page.screenshot(path="final_verification_hero.png")

        # Test theme switching to ensure ReactiveBackground picks up new colors
        await page.click(".palette-btn")
        await page.wait_for_timeout(500)
        await page.screenshot(path="final_verification_theme_switch.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_final_redesign())
