package interfaces

import "context"

type tokenServiceInterface interface {
	GeneratePair(ctx context.Context, userID uint, rememberMe bool) (string, string, error)
	RefreshToken(ctx context.Context, refreshTokenStr string) error
	RevokeUserTokens(ctx context.Context, userID uint) error
}
