package usecases

import (
	"context"

	"github.com/mirocinema/media-service/internal/application/dto"
	"github.com/mirocinema/media-service/internal/infrastructure/storage"
)

type DeleteUseCase struct {
	storage storage.Storage
}

func NewDeleteUseCase(s storage.Storage) *DeleteUseCase {
	return &DeleteUseCase{storage: s}
}

func (u *DeleteUseCase) Execute(ctx context.Context, input dto.DeleteMediaRequest) (*dto.DeleteMediaResponse, error) {
	err := u.storage.Delete(ctx, input.Key)
	if err != nil {
		return nil, err
	}
	return &dto.DeleteMediaResponse{OK: true}, nil
}
