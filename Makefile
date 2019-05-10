test:
	npm ci
	npm run test:browser
	npm run test:cover

publish: validate-git-status test
	npm publish
	git push origin master
	git push origin master --tags

validate-git-status:
	@ git fetch
	@ if [ "`git symbolic-ref --short HEAD`" != "master" ] ; \
		then echo "Not on the master branch!\n" ; exit 1 ; \
	fi
	@ if [ "`git rev-parse --short master`" != "`git rev-parse --short origin/master`" ] ; \
		then echo "Git commit mismatch in local and remote!\n" ; git status ; exit 1 ; \
	fi
	@ if ! git diff --exit-code --quiet ; \
		then echo "Local differences!\n" ; git status ; exit 1 ; \
	fi



.PHONY: test dist validate-branch
