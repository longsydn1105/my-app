package service

import (
	"github.com/longdaica/my-app/backend/interfaces"
	"github.com/longdaica/my-app/backend/model"
	"golang.org/x/crypto/bcrypt"
)

type authService struct {
	userRepo interfaces.UserRepositoryInterface
}

func NewAuthService(repo interfaces.UserRepositoryInterface) interfaces.AuthServiceInterface {
	return &authService{userRepo: repo}
}

func (s *authService) RegisterLogic(email, password, name string) error {
	_, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return err
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	newUser := &model.User{
		Email:    email,
		Password: string(hashedPassword),
		Name:     name,
	}
	return s.userRepo.CreateUser(newUser)
}
func (s *authService) Login(email, password string) error {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return err
	} else {
		return nil
	}
}
