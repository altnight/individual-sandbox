SCREENSHHOTS_DIR=screenshots
CHROME_DRIVER_URL=https://chromedriver.storage.googleapis.com/2.33/chromedriver_mac64.zip

# entrypoint
google: get_chromedriver refresh_screenshots_dir crawl_google op
sample: get_chromedriver refresh_screenshots_dir crawl_sample op
all: get_chromedriver refresh_screenshots_dir crawl_google crawl_sample op

refresh_screenshots_dir:
	rm -r $(SCREENSHHOTS_DIR)
	mkdir -p $(SCREENSHHOTS_DIR)

get_chromedriver:
	rm -fv chromedriver
	wget $(CHROME_DRIVER_URL)
	unzip chromedriver_mac64.zip
	rm -fv chromedriver_mac64.zip

install:
	virtualenv -p python3.6 venv
	./venv/bin/pip install -r requirements.txt -c constraints.txt

sample_server: install
	./venv/bin/python server.py &

crawl_google: install
	PATH=.:${PATH} ./venv/bin/python run.py google
crawl_sample: install sample_server
	PATH=.:${PATH} ./venv/bin/python run.py sample

op:
	open $(SCREENSHHOTS_DIR)

.PHONY: all google sample refresh_screenshots_dir get_chromedriver install sample_server crawl op
