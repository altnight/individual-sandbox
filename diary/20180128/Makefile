clean:
	rm -r node_modules

entry: clean
	[ -f README.md ] && rm README.md
	touch README.md

	cat entry.md >> README.md

	echo '\n## スクリプト' >> README.md
	echo '\n```javascript' >> README.md
	cat index.js >> README.md
	echo '```' >> README.md

	echo '\n## 実行結果' >> README.md
	echo '\n```' >> README.md
	make all >> README.md
	echo '```' >> README.md

all:
	npm install
	npm start

.PHONY: clean entry all
