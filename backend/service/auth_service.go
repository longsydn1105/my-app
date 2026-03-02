package service

import (
	"errors"
	"fmt"

	"connectrpc.com/connect"
	"github.com/longdaica/my-app/backend/interfaces"
	"github.com/longdaica/my-app/backend/model"
	"github.com/longdaica/my-app/backend/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authService struct {
	userRepo     interfaces.UserRepositoryInterface
	emailService interfaces.EmailServiceInterface
}

func NewAuthService(repo interfaces.UserRepositoryInterface, mailSvc interfaces.EmailServiceInterface) interfaces.AuthServiceInterface {
	return &authService{
		userRepo:     repo,
		emailService: mailSvc,
	}
}

func (s *authService) RegisterLogic(email, password, name string) error {
	_, err := s.userRepo.FindByEmail(email)
	if err == nil {
		return connect.NewError(
			connect.CodeAlreadyExists,
			errors.New("email already exists"),
		)
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
	err = s.userRepo.CreateUser(newUser)
	if err != nil {
		return err // Lỗi lưu DB thì cook
	}

	go func() {
		errMail := s.emailService.SendWelcomeToMail(newUser.Email, newUser.Name)
		if errMail != nil {
			fmt.Println("❌ Lỗi gửi mail cho", newUser.Email, ":", errMail.Error())
		}
	}()
	return nil
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
		return "", errors.New("Incorrect password or account!!")
	}

	token, err := jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return "", errors.New("lỗi token: " + err.Error())
	}
	return token, nil
}
