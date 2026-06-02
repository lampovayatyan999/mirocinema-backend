package logger

import (
	"log"
	"os"
	"strings"
)

var level = "info"

func Init(lvl string) {
	level = strings.ToLower(lvl)

	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	log.Printf("[LOGGER] initialized with level: %s", level)
}

func Info(format string, v ...any) {
	if levelAllowed("info") {
		log.Printf("[INFO] "+format, v...)
	}
}

func Warn(format string, v ...any) {
	if levelAllowed("warn") {
		log.Printf("[WARN] "+format, v...)
	}
}

func Error(format string, v ...any) {
	if levelAllowed("error") {
		log.Printf("[ERROR] "+format, v...)
	}
}

func Fatal(format string, v ...any) {
	log.Printf("[FATAL] "+format, v...)
	os.Exit(1)
}

// helpers

func levelAllowed(l string) bool {
	levels := map[string]int{
		"debug": 1,
		"info":  2,
		"warn":  3,
		"error": 4,
		"fatal": 5,
	}

	return levels[strings.ToLower(level)] <= levels[l]
}
