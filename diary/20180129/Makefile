default:
	npm install
	npm start

clean:
	if [ -d node_modules ]; then rm -r node_modules; fi
	if [ -f README.md ]; then  rm README.md; fi

version:
	node --version
	npm --version

entry: clean
	touch README.md

	cat entry.md >> README.md

	echo '\n## 環境' >> README.md
	echo '\n```' >> README.md
	make version >> README.md
	echo '```' >> README.md

	echo '\n## スクリプト' >> README.md
	echo '\n```javascript' >> README.md
	cat index.js >> README.md
	echo '```' >> README.md

	echo '\n## 実行結果' >> README.md
	echo '\n```' >> README.md
	make >> README.md
	echo '```' >> README.md

.PHONY: default clean version entry
