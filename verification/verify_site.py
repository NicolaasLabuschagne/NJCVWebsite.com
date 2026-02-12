from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000", wait_until="networkidle")
            # Wait for content to render
            page.wait_for_selector("h1")
            page.screenshot(path="verification/site_full.png", full_page=True)

            # Take screenshots of sections
            sections = ["home", "about", "skills", "experience", "work", "contact"]
            for section in sections:
                el = page.locator(f"#{section}")
                if el.count() > 0:
                    el.screenshot(path=f"verification/section_{section}.png")

            print("Screenshots taken successfully")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
