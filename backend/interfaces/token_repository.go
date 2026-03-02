package interfaces

import (
	"context"

	"github.com/longdaica/my-app/backend/model"
)

type TokenRepositoryInterface interface {
	Create(ctx context.Context, token *model.RefeshToken) error
	FindByToken(ctx context.Context, token string) (*model.RefeshToken, error)
	DeleteByUserID(ctx context.Context, userID uint) error
}	
