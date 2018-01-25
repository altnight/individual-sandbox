prepare:
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt

select_related: prepare
	./venv/bin/python django_select_related.py

prefetch_related: prepare
	./venv/bin/python django_prefetch_related.py

.PHONY: prepare select_related prefetch_related
