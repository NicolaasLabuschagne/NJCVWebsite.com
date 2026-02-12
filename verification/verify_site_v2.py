from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000", wait_until="networkidle")
            page.wait_for_selector("h1")

            # Scroll down slowly to trigger animations
            for i in range(10):
                page.mouse.wheel(0, 500)
                time.sleep(0.5)

            # Scroll back to top
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(1)

            page.screenshot(path="verification/site_animated.png", full_page=True)

            sections = ["home", "about", "skills", "experience", "work", "contact"]
            for section in sections:
                el = page.locator(f"#{section}")
                if el.count() > 0:
                    el.scroll_into_view_if_needed()
                    time.sleep(1) # wait for animation
                    el.screenshot(path=f"verification/section_{section}_v2.png")

            print("Screenshots taken successfully")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
