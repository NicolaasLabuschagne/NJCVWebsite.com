
import asyncio
from playwright.async_api import async_playwright
import os

async def run_verification():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Log console messages
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        # Load the local file
        path = os.path.abspath('index.html')
        await page.goto(f'file://{path}')
        # Increased wait for window.onload and p5/flipbook
        await page.wait_for_timeout(5000)

        # Check if pageFlip is defined
        is_init = await page.evaluate("typeof pageFlip !== 'undefined'")
        print(f"pageFlip initialized: {is_init}")

        if is_init:
            count = await page.evaluate("pageFlip.getPageCount()")
            print(f"Total pages: {count}")
        else:
            print("pageFlip is NOT initialized. Check console errors.")

        # Create screenshots directory
        os.makedirs('verification', exist_ok=True)

        # Take screenshot of Cover
        await page.screenshot(path='verification/cover_page.png')

        if is_init:
            # Flip to Hero (Page 2)
            print("Flipping to Hero...")
            await page.evaluate("pageFlip.flip(2)")
            await page.wait_for_timeout(3000)
            await page.screenshot(path='verification/hero_page.png')

            # Flip to About (Page 4)
            print("Flipping to About...")
            await page.evaluate("pageFlip.flip(4)")
            await page.wait_for_timeout(3000)
            await page.screenshot(path='verification/about_page.png')

            # Flip to Experience (Page 8)
            print("Flipping to Experience...")
            await page.evaluate("pageFlip.flip(8)")
            await page.wait_for_timeout(3000)
            await page.screenshot(path='verification/experience_page.png')

            # Toggle Dark Mode
            print("Toggling dark mode...")
            await page.click('#theme-toggle')
            await page.wait_for_timeout(1000)
            await page.screenshot(path='verification/dark_mode.png')
        else:
            # If not init, just take a screenshot of whatever is there
            await page.screenshot(path='verification/error_state.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_verification())
