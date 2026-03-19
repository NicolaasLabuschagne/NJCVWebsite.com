
import asyncio
from playwright.async_api import async_playwright
import os

async def verify_mobile():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 375, 'height': 812}) # iPhone X size

        # Start the server if it's not running
        # Assuming http-server is installed and can be run

        url = "http://localhost:8080"
        try:
            await page.goto(url)
            await asyncio.sleep(2) # wait for animations

            await page.screenshot(path="verification/mobile_hero.png")

            # Scroll to marquee
            await page.evaluate("window.scrollTo(0, 800)")
            await asyncio.sleep(1)
            await page.screenshot(path="verification/mobile_marquee.png")

            # Scroll to journey
            await page.goto(f"{url}#journey")
            await asyncio.sleep(1)
            await page.screenshot(path="verification/mobile_journey.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_mobile())
