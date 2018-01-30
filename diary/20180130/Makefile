default:
	# mac: open finder, input URL 'about:debugging', click 'Load Temporary Add-on', load manifest.json
	open -a firefox .

clean:
	if [ -f README.md ]; then  rm README.md; fi

entry: clean
	touch README.md
	cat entry.md >> README.md

.PHONY: default clean entry
