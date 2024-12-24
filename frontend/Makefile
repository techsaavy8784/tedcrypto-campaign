.SILENT:

include .env

IMAGE_NAME ?= ted-validator-tools-frontend-pro

.PHONY: build
build:
	@docker build -f docker/Dockerfile -t $(IMAGE_NAME) .

.PHONY: run up
run up:
	@docker run -p 8080:80 -it -d $(IMAGE_NAME)
	@echo "Open http://localhost:8080"

.PHONY: stop
stop:
	@docker stop $$(docker ps -a -q --filter ancestor=$(IMAGE_NAME))
	@echo "Containers stopped"

.PHONY: down
down: stop
	@docker rm $$(docker ps -a -q --filter ancestor=$(IMAGE_NAME))
	@echo "Containers removed"
