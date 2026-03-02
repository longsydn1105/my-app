package service

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/longdaica/my-app/backend/interfaces"
)

type tokenService struct {
	repo          interfaces.TokenRepositoryInterface
	accessSecret  string
	refreshSecret string
}

func NewTokenService(repo interfaces.TokenRepositoryInterface, accSec, refSec string) interfaces.TokenRepositoryInterface {
	return &tokenService{repo: repo, accessSecret: accSec, refreshSecret: refSec}
}

func (s *tokenService) GeneratePair(ctx context.Context, userID uint, rememberMe bool) (string, string, error) {

}

func (s *tokenService) RefreshToken(ctx context.Context, refreshTokenStr string) error {}
func (s *tokenService) RevokeUserTokens(ctx context.Context, userID uint) error        {}

func (s *tokenService) creatJWT(userID uint, ttl time.Duration, secret string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(ttl).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
