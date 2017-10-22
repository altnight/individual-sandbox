from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

GOOGLE_CHROME_BINARY_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
SCREEN_SHOTS_DIR = 'screenshots'


class Step:
    verbose_name = None

    def __init__(self, driver):
        self.driver = driver

    def run(self):
        self.pre_process()
        self.process()
        self.post_process()

    def pre_process(self):
        pass

    def process(self):
        raise NotImplementedError()

    def post_process(self):
        pass

    def take_screenshot(self):
        if self.verbose_name:
            filename = self.verbose_name
        else:
            filename = self.__class__.__name__
        self.driver.save_screenshot("{}.png".format(Path(SCREEN_SHOTS_DIR, filename)))

    def enter(self, input_element, char):
        input_element.send_keys(char)
        input_element.send_keys(Keys.RETURN)

class BaseCrawler:
    def __init__(self, args, *a, **kw):

        options = Options()
        options.binary_location = GOOGLE_CHROME_BINARY_PATH
        options.add_argument('--window-size={},{}'.format(args.width, args.height))
        if not args.debug:
            options.add_argument('--headless')

        self.driver = webdriver.Chrome(chrome_options=options)

    def run(self):
        try:
            for Step in self.steps:
                Step(self.driver).run()
        finally:
            self.driver.quit()
