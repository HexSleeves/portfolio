.PHONY: build run clean static

build:
	go build -o portfolio ./cmd/srv

run: build
	./portfolio -listen :8000

static:
	go run ./cmd/build -out dist -github HexSleeves

clean:
	rm -rf portfolio dist
