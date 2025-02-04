
test:
	npm run test

test-all:
	npm ci
	npm publish --dry-run --tag "$(shell node --experimental-strip-types tools/get-release-tag.mjs)"

publish: validate-git-status
	npm publish --tag "$(shell node --experimental-strip-types tools/get-release-tag.mjs)"
	git push origin main
	git push origin --tags

validate-git-status:
	@ if [ "`git symbolic-ref --short HEAD`" != "main" ] ; \
		then echo "Not on the main branch!\n" ; exit 1 ; \
	fi
	@ if ! git diff --exit-code --quiet ; \
		then echo "Local differences!\n" ; git status ; exit 1 ; \
	fi
	git pull

profile-encode:
		npx rimraf isolate-*.log
		node --prof --require ts-node/register -e 'require("./benchmark/profile-encode")'
		node --prof-process --preprocess -j isolate-*.log | npx flamebearer

profile-decode:
		npx rimraf isolate-*.log
		node --prof --require ts-node/register  -e 'require("./benchmark/profile-decode")'
		node --prof-process --preprocess -j isolate-*.log | npx flamebearer

benchmark:
	npx node -r ts-node/register benchmark/benchmark-from-msgpack-lite.ts
	@echo
	node benchmark/msgpack-benchmark.js

.PHONY: test dist validate-branch benchmark
