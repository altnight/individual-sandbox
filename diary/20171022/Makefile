LIB_PATH=individual-sandbox/diary/20171022
SCREENSHHOTS_DIR=screenshots
CHROME_DRIVER_URL=https://chromedriver.storage.googleapis.com/2.33/chromedriver_mac64.zip

# entrypoint
install: get_chromedriver update_repo prepare
	mkdir -p $(SCREENSHHOTS_DIR)
google: crawl_google op
auth_sample: crawl_auth_sample op
all: get_chromedriver refresh_screenshots_dir update_repo crawl_google crawl_auth_sample op

refresh_screenshots_dir:
	rm -fvr $(SCREENSHHOTS_DIR)
	mkdir -p $(SCREENSHHOTS_DIR)

get_chromedriver:
	rm -fv chromedriver
	wget $(CHROME_DRIVER_URL)
	unzip chromedriver_mac64.zip
	rm -fv chromedriver_mac64.zip

update_repo:
	rm -fvr individual-sandbox
	git clone --depth 1 git@github.com:altnight/individual-sandbox.git

prepare:
	virtualenv -p python3.6 venv
	./venv/bin/pip install -e $(LIB_PATH)
	./venv/bin/pip install -r $(LIB_PATH)/requirements.txt -c $(LIB_PATH)/constraints.txt

crawl_google: prepare
	cp $(LIB_PATH)/sample/google/crawler.py google_crawler.py
	PATH=.:${PATH} ./venv/bin/crawl google_crawler
crawl_auth_sample: prepare
	./venv/bin/pip install -r $(LIB_PATH)/sample/requirements-sample.txt -c $(LIB_PATH)/constraints.txt
	./venv/bin/python $(LIB_PATH)/sample/auth_sample/server.py &

	cp $(LIB_PATH)/sample/auth_sample/crawler.py auth_sample_crawler.py
	PATH=.:${PATH} ./venv/bin/crawl auth_sample_crawler.py

op:
	open $(SCREENSHHOTS_DIR)

.PHONY: all google auth_sample refresh_screenshots_dir get_chromedriver install update_repo crawl_google crawl_auth_sample op
