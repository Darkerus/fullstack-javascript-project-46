install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npm run lint
test:
	npm run test
test-coverage:
	npm run test -- --coverage --coverageProvider=v8
