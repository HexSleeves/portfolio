.PHONY: build run clean static

build:
	go build -o portfolio ./cmd/srv

run: build
	./portfolio -listen :8000

static:
	go run ./cmd/build -out dist -github HexSleeves

clean:
	rm -rf portfolio dist

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  build - Build the server"
	@echo "  run - Run the server"
	@echo "  static - Build the static site"
	@echo "  clean - Clean build artifacts"
	@echo "  help - Show this help message"
