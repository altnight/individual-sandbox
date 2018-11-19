import os
import time

from selenium import webdriver

BROWSER_HEIGHT = 1024
BROWSER_WIDTH = 800
USERNAME = os.environ.get("APP_USERNAME")
PASSWORD = os.environ.get("APP_PASSWORD")
BOARD_ID = os.environ.get("APP_BOARD_ID")
DRIVER_PATH = os.environ.get("APP_WEBDRIVER_PATH", "geckodriver")
HEADLESS = os.environ.get("APP_ENABLE_HEADLESS", True)


class SiteCapture:
    def __init__(self):
        firefox_options = webdriver.FirefoxOptions()
        if HEADLESS:
            firefox_options.add_argument("-headless")
        self.driver = webdriver.Firefox(
            executable_path=DRIVER_PATH,
            options=firefox_options,
        )
        self.driver.set_window_size(BROWSER_HEIGHT, BROWSER_WIDTH)

    def step_login(self):
        self.driver.get("https://trello.com/login")

        self.driver.find_element_by_css_selector("#user").send_keys(USERNAME)
        self.driver.find_element_by_css_selector("#password").send_keys(PASSWORD)
        self.driver.find_element_by_css_selector("#login").click()

    def step_snap(self):
        # implicitly_wait だとボード画面に遷移できない
        time.sleep(3)
        self.driver.get(f"https://trello.com/b/{BOARD_ID}/")
        self.driver.get_screenshot_as_file('board.png')

    def close(self):
        self.driver.close()


def main():
    site_capture = SiteCapture()
    try:
        site_capture.step_login()
        site_capture.step_snap()
    finally:
        site_capture.close()

if __name__ == "__main__":
    main()
