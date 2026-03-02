package repository

import (
	"context"

	"github.com/longdaica/my-app/backend/interfaces"
	"github.com/longdaica/my-app/backend/model"
	"gorm.io/gorm"
)

type tokenRepo struct {
	db *gorm.DB
}

func NewTokenRepository(db *gorm.DB) interfaces.TokenRepositoryInterface {
	return &tokenRepo{db: db}
}

func (r *tokenRepo) Create(ctx context.Context, token *model.RefeshToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *tokenRepo) FindByToken(ctx context.Context, token string) (*model.RefeshToken, error) {
	var res model.RefeshToken
	err := r.db.WithContext(ctx).Where("token = ?", token).First(&res).Error
	return &res, err
}

func (r *tokenRepo) DeleteByUserID(ctx context.Context, userID uint) error {
	return r.db.WithContext(ctx).Where("user_id = ?", userID).Delete(model.RefeshToken{}).Error
}
