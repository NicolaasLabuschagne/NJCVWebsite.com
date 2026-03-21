import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Start local server
        os.system("npm run serve > /dev/null 2>&1 &")
        await asyncio.sleep(2)

        await page.goto("http://localhost:8080")

        output_dir = "verification_v5"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        vibes = ["theme-creative", "theme-professional", "theme-fun"]
        modes = ["light", "dark"]

        for vibe in vibes:
            # Set vibe
            await page.evaluate(f"document.body.className = '{vibe}'")

            for mode in modes:
                # Set light/dark mode
                if mode == "dark":
                    await page.evaluate("document.documentElement.classList.add('dark'); document.documentElement.setAttribute('data-theme', 'dark')")
                else:
                    await page.evaluate("document.documentElement.classList.remove('dark'); document.documentElement.setAttribute('data-theme', 'light')")

                await asyncio.sleep(1) # wait for animations

                # Take full page screenshot
                screenshot_path = f"{output_dir}/{vibe}_{mode}.png"
                await page.screenshot(path=screenshot_path, full_page=True)
                print(f"Captured {screenshot_path}")

        # Kill server
        os.system("kill $(lsof -t -i :8080) 2>/dev/null || true")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
