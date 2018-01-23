prepare:
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt

pdbpp: prepare
	./venv/bin/pytest -pdb tests_pdb.py

ipdb: prepare
	./venv/bin/pytest -s tests_ipdb.py

.PHONY: prepare dpbpp ipdb
