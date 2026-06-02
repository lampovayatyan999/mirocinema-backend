package usecases

import (
	"context"

	"github.com/mirocinema/media-service/internal/application/dto"
	"github.com/mirocinema/media-service/internal/infrastructure/storage"
)

type GetUseCase struct {
	storage storage.Storage
}

func NewGetUseCase(s storage.Storage) *GetUseCase {
	return &GetUseCase{storage: s}
}

func (u *GetUseCase) Execute(
	ctx context.Context,
	input dto.GetMediaRequest,
) (*dto.GetMediaResponse, error) {

	reader, contentType, err := u.storage.GetStream(ctx, input.Key)
	if err != nil {
		return nil, err
	}

	return &dto.GetMediaResponse{
		Reader:      reader,
		ContentType: contentType,
	}, nil
}
