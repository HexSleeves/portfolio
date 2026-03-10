.DEFAULT_GOAL := help

GO ?= go
APP ?= portfolio
LISTEN_ADDR ?= :8000
DIST_DIR ?= dist
RELEASE_BIN_DIR ?= $(DIST_DIR)/bin
GITHUB_USER ?= HexSleeves
PAGES_BASE ?= /portfolio
GOLANGCI_LINT_VERSION ?= v2.11.3
GOLANGCI_LINT ?= $(GO) run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@$(GOLANGCI_LINT_VERSION)
GOVULNCHECK ?= $(if $(shell command -v govulncheck 2>/dev/null),govulncheck,$(GO) run golang.org/x/vuln/cmd/govulncheck@latest)
GOSEC ?= $(if $(shell command -v gosec 2>/dev/null),gosec,$(GO) run github.com/securego/gosec/v2/cmd/gosec@latest)
GOFILES := $(shell find . -type f -name '*.go' -not -path './.git/*' -not -path './dist/*')

.PHONY: help
.PHONY: download build run clean restart dev
.PHONY: test test-race coverage
.PHONY: fmt fmt-check tidy tidy-check
.PHONY: lint vulncheck gosec security
.PHONY: static pages-build release-build
.PHONY: ci checks

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "App targets:"
	@echo "  build         Build the server binary"
	@echo "  run           Build and run the server"
	@echo "  restart       Rebuild and restart the server in the background"
	@echo "  dev           Rebuild and run the server in the foreground"
	@echo "  clean         Remove build artifacts"
	@echo ""
	@echo "Build targets:"
	@echo "  static        Build the static site into $(DIST_DIR)"
	@echo "  pages-build   Build the GitHub Pages site with base path $(PAGES_BASE)"
	@echo "  release-build Build release binaries into $(RELEASE_BIN_DIR)"
	@echo ""
	@echo "Check targets:"
	@echo "  test          Run the standard test suite"
	@echo "  test-race     Run tests with race detection and coverage output"
	@echo "  coverage      Alias for test-race"
	@echo "  fmt           Format Go files"
	@echo "  fmt-check     Fail if Go files are not gofmt-formatted"
	@echo "  tidy          Run go mod tidy"
	@echo "  tidy-check    Fail if go mod tidy would change go.mod or go.sum"
	@echo "  lint          Run golangci-lint"
	@echo "  vulncheck     Run govulncheck"
	@echo "  gosec         Run gosec"
	@echo "  security      Run vulncheck and gosec"
	@echo "  checks        Run local verification checks"
	@echo "  ci            Run the full local CI workflow"

download:
	$(GO) mod download

build:
	$(GO) build -o $(APP) ./cmd/srv

run: build
	./$(APP) -listen $(LISTEN_ADDR)

test:
	$(GO) test -v ./...

test-race:
	$(GO) test -v -race -coverprofile=coverage.out ./...

coverage: test-race

fmt:
	gofmt -w $(GOFILES)

fmt-check:
	@if [ -n "$$(gofmt -l $(GOFILES))" ]; then \
		echo "Code is not formatted. Run 'make fmt'."; \
		gofmt -d $(GOFILES); \
		exit 1; \
	fi

tidy:
	$(GO) mod tidy

tidy-check:
	$(GO) mod tidy
	git diff --exit-code go.mod go.sum

lint:
	$(GOLANGCI_LINT) run ./...

vulncheck:
	$(GOVULNCHECK) ./...

gosec:
	$(GOSEC) -fmt text ./...

security: vulncheck gosec

static:
	$(GO) run ./cmd/build -out $(DIST_DIR) -github $(GITHUB_USER)

pages-build:
	$(GO) run ./cmd/build -out $(DIST_DIR) -github $(GITHUB_USER) -base $(PAGES_BASE)

release-build:
	mkdir -p $(RELEASE_BIN_DIR)
	GOOS=linux GOARCH=amd64 $(GO) build -o $(RELEASE_BIN_DIR)/portfolio-linux-amd64 ./cmd/srv
	GOOS=linux GOARCH=arm64 $(GO) build -o $(RELEASE_BIN_DIR)/portfolio-linux-arm64 ./cmd/srv
	GOOS=darwin GOARCH=amd64 $(GO) build -o $(RELEASE_BIN_DIR)/portfolio-darwin-amd64 ./cmd/srv
	GOOS=darwin GOARCH=arm64 $(GO) build -o $(RELEASE_BIN_DIR)/portfolio-darwin-arm64 ./cmd/srv
	GOOS=windows GOARCH=amd64 $(GO) build -o $(RELEASE_BIN_DIR)/portfolio-windows-amd64.exe ./cmd/srv

checks: fmt-check tidy-check lint test-race security

ci: download checks build static pages-build

clean:
	rm -rf $(APP) $(DIST_DIR) coverage.out

restart: build
	@pkill -x $(APP) 2>/dev/null || true
	@sleep 1
	./$(APP) -listen $(LISTEN_ADDR) &
	@echo "Server running on $(LISTEN_ADDR) (background)"

dev: build
	@pkill -x $(APP) 2>/dev/null || true
	@sleep 1
	./$(APP) -listen $(LISTEN_ADDR)
