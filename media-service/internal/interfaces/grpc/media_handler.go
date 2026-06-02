package grpc

import (
	"bytes"
	"context"

	pb "github.com/mirocinema/contracts/media"
	"github.com/mirocinema/media-service/internal/application/dto"
	"github.com/mirocinema/media-service/internal/application/usecases"
)

type MediaHandler struct {
	pb.UnimplementedMediaServiceServer
	uploadUC *usecases.UploadUseCase
	getUC    *usecases.GetUseCase
	deleteUC *usecases.DeleteUseCase
}

func NewMediaHandler(
	u *usecases.UploadUseCase,
	g *usecases.GetUseCase,
	d *usecases.DeleteUseCase,
) *MediaHandler {
	return &MediaHandler{
		uploadUC: u,
		getUC:    g,
		deleteUC: d,
	}
}

func (h *MediaHandler) Upload(
	ctx context.Context,
	req *pb.UploadRequest,
) (*pb.UploadResponse, error) {
	res, err := h.uploadUC.Execute(ctx, dto.UploadMediaRequest{
		FileName:    req.FileName,
		Folder:      req.Folder,
		ContentType: req.ContentType,
		Reader:      bytes.NewReader(req.Data),
		Size:        int64(len(req.Data)),
	})

	if err != nil {
		return nil, err
	}

	return &pb.UploadResponse{
		Key: res.Key,
	}, nil
}
