"""
- https://qiita.com/orangain/items/db4594113c04e8801aad
"""
from pathlib import Path
import time
import inspect

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

GOOGLE_CHROME_BINARY_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
SCREEN_SHOTS_DIR = 'screenshots'


class GoogleCrowler:
    def __init__(self, *a, **kw):
        self.driver = None
        self._initialize()

    def process(self):
        for i in inspect.getmembers(self):
            if i[0].startswith("process_"):
                eval("self.{}()".format(i[0]))
        # self.process_result()
        # self.process_first()

    def process_result(self):
        self.driver.get('https://google.co.jp/')
        assert 'Google' in self.driver.title

        self._enter(self.driver.find_element_by_name('q'), 'Python')

        self.driver.save_screenshot("{}.png".format(Path(SCREEN_SHOTS_DIR, inspect.currentframe().f_code.co_name)))

    def process_first(self):
        self.driver.get('https://google.co.jp/')
        assert 'Google' in self.driver.title

        self._enter(self.driver.find_element_by_name('q'), 'Python')
        self.driver.find_elements_by_css_selector("#res a")[0].click()

        self.driver.save_screenshot("{}.png".format(Path(SCREEN_SHOTS_DIR, inspect.currentframe().f_code.co_name)))

    def _enter(self, input_element, char):
        input_element.send_keys(char)
        input_element.send_keys(Keys.RETURN)

    def _initialize(self):
        options = Options()
        options.add_argument('--window-size={},{}'.format(1024, 1920)) # 768
        options.binary_location = GOOGLE_CHROME_BINARY_PATH
        options.add_argument('--headless')
        self.driver = webdriver.Chrome(chrome_options=options)

def main():
    c = GoogleCrowler()
    try:
        c.process()
    finally:
        c.driver.quit()

if __name__ == "__main__":
    main()
