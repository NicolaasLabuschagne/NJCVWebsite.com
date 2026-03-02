
from playwright.sync_api import sync_playwright
import time
import os

def capture_minimalist():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Access local file
        current_dir = os.getcwd()
        page.goto(f"file://{current_dir}/index.html")

        # Wait for p5.js and animations
        time.sleep(2)

        # Capture sections
        sections = [
            ("hero", "min_01_hero.png"),
            ("about", "min_02_about.png"),
            ("journey", "min_03_journey.png"),
            ("skills", "min_04_skills.png"),
            ("education", "min_05_education.png"),
            ("languages", "min_06_languages.png"),
            ("contact", "min_07_contact.png")
        ]

        for section_id, filename in sections:
            page.locator(f"#{section_id}").scroll_into_view_if_needed()
            time.sleep(1)
            page.screenshot(path=f"verification/{filename}")

        # Test Light Theme
        page.click("#theme-toggle")
        time.sleep(1)
        page.screenshot(path="verification/min_08_light_mode.png")

        # Test Mobile Menu
        page.set_viewport_size({"width": 375, "height": 667})
        time.sleep(1)
        page.click(".mobile-nav-toggle")
        time.sleep(1)
        page.screenshot(path="verification/min_09_mobile_menu.png")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    capture_minimalist()
