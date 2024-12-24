.DEFAULT_GOAL := help
.PHONY: tests
.SILENT:

include .env

## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

PROJECT_NAME = 'tedcrypto-campaign-app'
NETWORK = 'tedcrypto-campaign-app'

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
		categoryMessage = match(lastLine, /^## \[(.*)\]/); \
		categoryLength = 0; \
		if (categoryMessage) { \
			categoryName = substr(lastLine, RSTART + 4, RLENGTH - 5); \
			categoryLength = length(categoryName) + 2; \
			if (!printedCategory[categoryName]) { \
				printedCategory[categoryName] = 1; \
				printf "\n${COLOR_COMMENT}%s:${COLOR_RESET}\n", categoryName; \
			} \
		} \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3 + categoryLength, RLENGTH); \
			printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

DOCKER_COMPOSE = docker compose --project-name $(PROJECT_NAME)
DOCKER_COMPOSE_EXEC ?= $(DOCKER_COMPOSE) exec

## [Docker] Start containers
up:
	$(DOCKER_COMPOSE) up -d

## [Docker] Stop containers
stop:
	$(DOCKER_COMPOSE) stop

## [Docker] Down containers
down:
	$(DOCKER_COMPOSE) down --remove-orphans --volumes

## [Docker] Build containers
build:
	$(DOCKER_COMPOSE) build

shell:
	$(DOCKER_COMPOSE_EXEC) node-app /bin/sh

## [NPM] Install packages
install:
	$(DOCKER_COMPOSE_EXEC) node-app npm install

## [NPM] Run npm command (COMMAND=command make npm-command)
npm-command:
	$(DOCKER_COMPOSE_EXEC) node-app npm $(COMMAND)

.PHONY: create-user create.user
## [App] Create Initial Admin user
create-user create.user:
	$(DOCKER_COMPOSE_EXEC) node-app npx ts-node bin/console create-teacher "admin@example.com" "Super Admin" admin
	echo "User: admin@example.com Password: admin created."

.PHONY: test run.test
## [Tests] Run tests
test run.test:
	if [ -z "$(NAME)" ]; then \
		read -p "Enter jest test regex: " NAME; \
    fi; \
	$(DOCKER_COMPOSE_EXEC) node-app npx jest --detectOpenHandles $$NAME

## [Tests] Run tests
tests:
	$(DOCKER_COMPOSE_EXEC) node-app npm test --detectOpenHandles

.PHONY: console-command console.command
## [Command] Run a command (COMMAND=command make command)
console-command console.command:
	if [ -z "$(COMMAND)" ]; then \
		read -p "Enter command name: " COMMAND; \
    fi; \
	$(DOCKER_COMPOSE_EXEC) node-app npx ts-node bin/console $(COMMAND)

.PHONY: db-diff db.diff
## [Database] Create migration with name (NAME=name-migration make db-create-migration)
db-diff db.diff:
	if [ -z "$(NAME)" ]; then \
		read -p "Enter migration name: " NAME; \
    fi; \
	$(DOCKER_COMPOSE_EXEC) node-app npx prisma migrate dev --name $$NAME --create-only
	@echo "Migration $$NAME created. Apply it with 'make db-migrate'"

.PHONY: db-migrate db.migrate
## [Database] Run migrations
db-migrate db.migrate:
	$(DOCKER_COMPOSE_EXEC) node-app npx prisma migrate deploy

.PHONY: db-migrate-undo
## [Database] Undo last migration
db-migrate-undo:
	$(DOCKER_COMPOSE_EXEC) node-app npx prisma migrate reset

.PHONY: db-generate db.generate
## [Database] Generate prisma client
db-generate db.generate:
	$(DOCKER_COMPOSE_EXEC) node-app npx prisma generate

.PHONY: db-test-setup db.test.setup db.tests.setup
## [DATABASE] Reset Database for tests
db-test-setup db.test.setup db.tests.setup:
	$(DOCKER_COMPOSE_EXEC) node-app npm run test:setup

.PHONY: db-dev-setup db.dev.setup
## [DATABASE] Reset Database for dev
db-dev-setup db.dev.setup:
	$(DOCKER_COMPOSE_EXEC) node-app npm run dev:setup

.PHONE: db-seed db.seed
## [DATABASE] Seed Database
db-seed db.seed:
	$(DOCKER_COMPOSE_EXEC) node-app npx prisma db seed
