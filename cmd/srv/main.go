package main

import (
	"flag"
	"fmt"
	"io"
	"os"

	"srv.exe.dev/srv"
)

var flagListenAddr = flag.String("listen", ":8000", "address to listen on")
var runFn = run

func main() {
	os.Exit(runMain(os.Stderr))
}

func runMain(stderr io.Writer) int {
	if err := runFn(); err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	return 0
}

func run() error {
	flag.Parse()
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}
	server, err := srv.New("db.sqlite3", hostname)
	if err != nil {
		return fmt.Errorf("create server: %w", err)
	}
	return server.Serve(*flagListenAddr)
}
