from crawlers.base import BaseCrawler, Step

BASE_URL = 'https://google.co.jp'


class SearchResult(Step):
    verbose_name = '検索結果一覧'

    def pre_process(self):
        self.driver.get(BASE_URL + '/')
        assert 'Google' in self.driver.title

    def process(self):
        self.enter(self.driver.find_element_by_name('q'), 'Python')

    def post_process(self):
        self.take_screenshot()

class SearchResultFirst(Step):
    verbose_name = '検索結果1件目'

    def pre_process(self):
        self.driver.get(BASE_URL + '/')
        assert 'Google' in self.driver.title
        self.enter(self.driver.find_element_by_name('q'), 'Python')

    def process(self):
        self.driver.find_elements_by_css_selector("#res a")[0].click()

    def post_process(self):
        self.take_screenshot()


class GoogleCrawler(BaseCrawler):
    def __init__(self, args):
        super().__init__(args)
        self.steps = [SearchResult, SearchResultFirst]
