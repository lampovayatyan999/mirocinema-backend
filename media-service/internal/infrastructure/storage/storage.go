package storage

import (
	"context"
	"io"
)

type FileInfo struct {
	URL      string
	Size     int64
	MIMEType string
}

type Storage interface {
	UploadStream(
		ctx context.Context,
		key string,
		reader io.Reader,
		contentType string,
	) error

	GetStream(
		ctx context.Context,
		key string,
	) (io.ReadCloser, string, error)

	Delete(ctx context.Context, key string) error
	Close() error
}
