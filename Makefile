dev:
	# bun install
	bun run dev

build:
	bun run build

makedb:
	bun x drizzle-kit generate
	bun x drizzle-kit migrate

parsecsv:
	bun run scripts/parsecsv.ts

docker:
	docker build -t 0stars .
	docker run -p 3000:3000 0stars

git:
	@git remote add dokku dokku@ssh.kbl.io:0stars

deploy:
	@git push dokku main
