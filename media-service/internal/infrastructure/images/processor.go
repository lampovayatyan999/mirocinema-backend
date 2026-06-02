package images

import (
	"io"
)

type ResizeOptions struct {
	Width  int
	Height int
	Crop   bool
}

type Processor interface {
	Process(input io.Reader, opts *ResizeOptions) (io.Reader, error)
}

type NoopProcessor struct{}

func NewImageProcessor() *NoopProcessor {
	return &NoopProcessor{}
}

func (p *NoopProcessor) Process(
	input io.Reader,
	opts *ResizeOptions,
) (io.Reader, error) {
	return input, nil
}
