import inspect
import os
import glob
import argparse
import importlib

from crawlers.base import BaseCrawler


def build_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(nargs='+', default='', dest='paths', type=str)
    parser.add_argument('--width', dest='width', default=1024, type=int)
    parser.add_argument('--height', dest='height', default=1920, type=int)
    parser.add_argument('--debug', dest='debug', default=False, action='store_true')
    args = parser.parse_args()
    return args

def main():
    import sys
    sys.path.append('')

    args = build_args()
    targets = []
    for paths in args.paths:
        x = os.path.splitext(paths)[0]
        m = importlib.import_module(x)
        for klass in inspect.getmembers(m, inspect.isclass):
            if BaseCrawler in klass[1].__bases__:
                targets.append(klass[1])

    for Crawler in targets:
        c = Crawler(args)
        c.run()

if __name__ == "__main__":
    main()
