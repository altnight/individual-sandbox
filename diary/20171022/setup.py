from setuptools import find_packages
from distutils.core import setup

setup(
    name="crawlers",
    version="0.1",
    packages=find_packages(),
    entry_points={
        'console_scripts': [
            'crawl = crawlers.run:main',
        ]
    },
)
