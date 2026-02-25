package service

import (
	"errors"

	"github.com/longdaica/my-app/backend/interfaces"
	"github.com/longdaica/my-app/backend/model"
	"github.com/longdaica/my-app/backend/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authService struct {
	userRepo interfaces.UserRepositoryInterface
}

func NewAuthService(repo interfaces.UserRepositoryInterface) interfaces.AuthServiceInterface {
	return &authService{userRepo: repo}
}

func (s *authService) RegisterLogic(email, password, name string) error {
	_, err := s.userRepo.FindByEmail(email)
	if err == nil {
		return errors.New("email này đã được sử dụng rồi!!")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
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
func (s *authService) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("tài khoản chưa tồn tại, vui lòng đăng ký trước")
		}
		return "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("sai mật khẩu!!")
	}

	token, err := jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return "", errors.New("lỗi token: " + err.Error())
	}
	return token, nil
}
