all: get_chromedriver screenshots_dir crawl op

screenshots_dir:
	mkdir -p screenshots

get_chromedriver:
	rm -fv chromedriver
	wget https://chromedriver.storage.googleapis.com/2.33/chromedriver_mac64.zip
	unzip chromedriver_mac64.zip
	rm -fv chromedriver_mac64.zip

venv:
	[[ ! -d venv ]] && virtualenv -p python3.6 venv

install: venv
	./venv/bin/pip install selenium

crawl: install
	PATH=.:${PATH} ./venv/bin/python google_crawler.py

op:
	open screenshots

.PHONY: all get_chromedriver screenshots_dir crawl install op
