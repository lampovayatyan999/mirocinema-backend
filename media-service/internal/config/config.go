package config

import (
	"os"
	"strings"
)

type Config struct {
	App struct {
		Env string
	}

	HTTP struct {
		Port string
		Host string
	}

	GRPC struct {
		Port string
		Host string
	}

	Storage struct {
		Driver    string
		Bucket    string
		Region    string
		Endpoint  string
		AccessKey string
		SecretKey string
		PublicURL string
	}

	Image struct {
		MaxSizeMB    int
		AllowedTypes []string
	}

	Logging struct {
		Level string
	}
}

func Load() *Config {
	var cfg Config
	loadFromEnv(&cfg)
	return &cfg
}

func loadFromEnv(cfg *Config) {
	get := func(key string) string {
		return strings.TrimSpace(os.Getenv(key))
	}

	// General
	cfg.App.Env = get("APP_ENV")

	// HTTP server
	cfg.HTTP.Port = get("HTTP_PORT")
	cfg.HTTP.Host = get("HTTP_HOST")

	// gRPC server
	cfg.GRPC.Port = get("GRPC_PORT")
	cfg.GRPC.Host = get("GRPC_HOST")

	// Storage
	cfg.Storage.Driver = get("S3_DRIVER")
	cfg.Storage.Bucket = get("S3_BUCKET")
	cfg.Storage.Region = get("S3_REGION")
	cfg.Storage.Endpoint = get("S3_ENDPOINT")
	cfg.Storage.AccessKey = get("S3_ACCESS_KEY")
	cfg.Storage.SecretKey = get("S3_SECRET_KEY")
	cfg.Storage.PublicURL = get("S3_PUBLIC_URL")

	// Logging
	cfg.Logging.Level = get("LOG_LEVEL")
}
