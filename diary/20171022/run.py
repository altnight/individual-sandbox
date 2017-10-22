import argparse

from crawlers.google.crawler import GoogleCrawler
from crawlers.sample.crawler import SampleCrawler


def main(args):
    targets = []
    if 'google' in args.targets:
        targets.append(GoogleCrawler)
    if 'sample' in args.targets:
        targets.append(SampleCrawler)

    for Crawler in targets:
        c = Crawler(args)
        c.run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(nargs='+', dest='targets', type=str,
                        help='google, sample')
    parser.add_argument('--width', dest='width', default=1024, type=int)
    parser.add_argument('--height', dest='height', default=1920, type=int)
    parser.add_argument('--debug', dest='debug', default=False, action='store_true')
    args = parser.parse_args()
    main(args)
