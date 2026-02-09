import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Open the local index.html
        path = os.path.abspath("index.html")
        await page.goto(f"file://{path}")
        await page.wait_for_timeout(2000) # Wait for p5.js to init

        # Check Hero background
        hero = page.locator("#home")
        await hero.screenshot(path="verify_hero_bg.png")
        print("Hero screenshot captured.")

        # Check Contact background
        contact = page.locator("#contact")
        await contact.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        await contact.screenshot(path="verify_contact_bg.png")
        print("Contact screenshot captured.")

        # Switch theme and check again
        await page.keyboard.press("ArrowRight")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="verify_theme_switch_sections.png")
        print("Theme switch screenshot captured.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
