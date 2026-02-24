package interfaces

import (
	"github.com/longdaica/my-app/backend/model"
)

type UserRepositoryInterface interface {
	CreateUser(user *model.User) error
	FindByEmail(email string) (*model.User, error)
}

