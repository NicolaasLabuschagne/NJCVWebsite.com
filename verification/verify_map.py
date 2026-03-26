import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def main():
    # Start the server on a different port
    port = 8087
    process = subprocess.Popen(["npx", "http-server", "-p", str(port)])
    time.sleep(2)  # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.set_viewport_size({"width": 1280, "height": 800})

            # Go to the local site
            url = f"http://localhost:{port}"
            await page.goto(url)

            # Wait for map to load
            await page.wait_for_selector("#experience-map")

            # Scroll to map
            await page.evaluate("document.getElementById('experience-map').scrollIntoView();")
            await asyncio.sleep(3) # Wait for animations and map rendering

            # Capture Dark Mode (Default)
            await page.screenshot(path="verification/map_dark_v3.png")
            print("Captured map_dark_v3.png")

            # Click theme toggle to switch to Light Mode
            # Force Light Mode
            await page.evaluate("""
                document.documentElement.classList.remove('dark');
                window.dispatchEvent(new Event('themeChanged'));
            """)
            await asyncio.sleep(2)

            await page.screenshot(path="verification/map_light_v3.png")
            print("Captured map_light_v3.png")

            await browser.close()
    finally:
        process.terminate()

if __name__ == "__main__":
    asyncio.run(main())
