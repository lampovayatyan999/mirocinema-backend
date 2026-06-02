package dto

import "io"

type UploadMediaRequest struct {
	FileName     string
	Folder       string
	ContentType  string
	ResizeWidth  int32
	ResizeHeight int32
	Preset       string
	Reader       io.Reader
	Size         int64
}

type UploadMediaResponse struct {
	Key string
}

type GetMediaRequest struct {
	Key string
}

type GetMediaResponse struct {
	Reader      io.ReadCloser
	ContentType string
}

type DeleteMediaRequest struct {
	Key string
}

type DeleteMediaResponse struct {
	OK bool
}
