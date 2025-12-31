.PHONY: build run clean static restart dev

build:
	go build -o portfolio ./cmd/srv

run: build
	./portfolio -listen :8000

static:
	go run ./cmd/build -out dist -github HexSleeves

clean:
	rm -rf portfolio dist

restart: build
	@pkill -x portfolio 2>/dev/null || true
	@sleep 1
	./portfolio -listen :8000 &
	@echo "Server running on :8000 (background)"

dev: build
	@pkill -x portfolio 2>/dev/null || true
	@sleep 1
	./portfolio -listen :8000

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  build - Build the server"
	@echo "  run - Run the server"
	@echo "  static - Build the static site"
	@echo "  clean - Clean build artifacts"
	@echo "  restart - Rebuild and restart the server (background)"
	@echo "  dev - Rebuild and run server in foreground (see logs)"
	@echo "  help - Show this help message"
