from selenium.webdriver.common.keys import Keys
from crawlers.base import BaseCrawler, Step

BASE_URL = 'http://localhost:5000'


class Top(Step):
    verbose_name = None

    def pre_process(self):
        self.driver.get(BASE_URL + '/')

    def process(self):
        pass

    def post_process(self):
        self.take_screenshot()

class Two(Step):
    verbose_name = None

    def pre_process(self):
        self.driver.get(BASE_URL + '/two')

    def process(self):
        pass

    def post_process(self):
        self.take_screenshot()

class LoginStep(Step):
    def login(self):
        self.driver.get(BASE_URL + '/login')
        self.driver.implicitly_wait(1)
        self.driver.find_element_by_name('username').send_keys('user')
        self.driver.find_element_by_name('password').send_keys('pass')
        self.driver.find_element_by_name('password').send_keys(Keys.RETURN)
        self.driver.implicitly_wait(1)

    def logout(self):
        self.driver.get(BASE_URL + '/logout')

class Mypage(LoginStep):
    def pre_process(self):
        self.login()

    def process(self):
        self.driver.get(BASE_URL + '/mypage')

    def post_process(self):
        self.take_screenshot()
        self.logout()


class SampleCrawler(BaseCrawler):
    def __init__(self, args):
        super().__init__(args)
        self.steps = [
            Top, Two, Mypage
        ]
