clean:
	[ -f README.md ] && rm README.md
	vagrant destroy -f

entry:
	touch README.md
	cat entry.md >> README.md
	echo '\n## 実行結果' >> README.md
	echo '\n```' >> README.md
	vagrant up >> README.md
	echo '```' >> README.md

all:
	vagrant up

.PHONY: clean entry all
