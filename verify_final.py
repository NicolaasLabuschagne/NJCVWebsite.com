import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Using a higher viewport for better screenshots
        await page.set_viewport_size({"width": 1280, "height": 800})

        await page.goto('http://localhost:8080')
        await asyncio.sleep(2) # wait for animations

        # Screenshot of the top (Hero)
        await page.screenshot(path='hero_verification.png')

        # Scroll to middle (Skills)
        await page.evaluate("window.scrollTo(0, 1500)")
        await asyncio.sleep(2)
        await page.screenshot(path='skills_verification.png')

        # Scroll to bottom (Coffee button)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(2)
        await page.screenshot(path='footer_verification.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
