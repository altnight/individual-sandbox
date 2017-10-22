"""
- https://qiita.com/orangain/items/db4594113c04e8801aad
"""
# import time
import argparse

from crawler import BaseCrawler, Step


class SearchResult(Step):
    verbose_name = '検索結果一覧'

    def pre_process(self):
        self.driver.get('https://google.co.jp/')
        assert 'Google' in self.driver.title

    def process(self):
        self.enter(self.driver.find_element_by_name('q'), 'Python')

    def post_process(self):
        self.take_screenshot()

class SearchResultFirst(Step):
    verbose_name = '検索結果1件目'

    def pre_process(self):
        self.driver.get('https://google.co.jp/')
        assert 'Google' in self.driver.title
        self.enter(self.driver.find_element_by_name('q'), 'Python')

    def process(self):
        self.driver.find_elements_by_css_selector("#res a")[0].click()

    def post_process(self):
        self.take_screenshot()


class GoogleCrowler(BaseCrawler):
    def __init__(self, args):
        super().__init__(args)
        self.steps = [SearchResult, SearchResultFirst]


def main(args):
    c = GoogleCrowler(args)
    c.run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--width', dest='width', default=1024, type=int)
    parser.add_argument('--height', dest='height', default=1920, type=int)
    parser.add_argument('--debug', dest='debug', default=False, action='store_true')
    args = parser.parse_args()
    main(args)
