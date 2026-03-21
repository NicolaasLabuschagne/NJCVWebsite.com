import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def capture_themes():
    async with async_playwright() as p:
        # Kill any existing server on 8080
        subprocess.run(['fuser', '-k', '8080/tcp'], capture_output=True)

        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Start local server
        server = subprocess.Popen(['npx', 'http-server', '-p', '8080'])
        await asyncio.sleep(3)  # Wait for server to start

        try:
            os.makedirs('verification_v2', exist_ok=True)

            modes = ['dark', 'light']
            vibes = ['theme-creative', 'theme-fun', 'theme-professional']

            for mode in modes:
                for vibe in vibes:
                    # Set mode and vibe via script
                    await page.goto('http://localhost:8080')
                    await page.evaluate(f"() => {{ \
                        const mode = '{mode}'; \
                        const vibe = '{vibe}'; \
                        document.documentElement.setAttribute('data-theme', mode); \
                        if (mode === 'dark') document.documentElement.classList.add('dark'); \
                        else document.documentElement.classList.remove('dark'); \
                        document.body.className = vibe; \
                        localStorage.setItem('theme', mode); \
                        localStorage.setItem('pet-theme', vibe); \
                    }}")

                    # Wait for transitions and images
                    await asyncio.sleep(2)

                    # Take screenshots
                    filename = f"verification_v2/{vibe}_{mode}.png"
                    await page.screenshot(path=filename, full_page=True)
                    print(f"Captured {filename}")

        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(capture_themes())
