test:
	npm ci
	npm run test:browser
	npm run test:cover

dist: test
	npm publish
	git push origin master
	git push origin master --tags

.PHONY: build test dist
