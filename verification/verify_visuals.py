
import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def verify_site():
    # Start a simple server
    server_process = subprocess.Popen(["npx", "http-server", "-p", "8080"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(2) # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto("http://localhost:8080")

            # Take full page screenshot
            await page.screenshot(path="verification/full_page.png", full_page=True)

            # Take screenshots of key sections
            for section in ["hero", "about", "skills", "journey"]:
                element = await page.query_selector(f"#{section}")
                if element:
                    await element.screenshot(path=f"verification/{section}.png")

            await browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_site())
