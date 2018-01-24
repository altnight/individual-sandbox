prepare:
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt

all: prepare
	./venv/bin/python -m unittest django_test_parameterized.py

.PHONY: prepare all
