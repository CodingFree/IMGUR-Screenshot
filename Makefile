package:
	zip package.zip -r imgur.js manifest.webapp style
test: 
	@./node_modules/mocha/bin/mocha
.PHONY: test
