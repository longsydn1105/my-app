package cmd

import (
	"net/http"

	"github.com/longdaica/my-app/backend/handler"
	"github.com/longdaica/my-app/backend/repository"
	"github.com/longdaica/my-app/backend/service"
	"gorm.io/gorm"
)

func SetupDI(db *gorm.DB) *http.ServeMux {
	userRepo := repository.NewUserRepository(db)
	mailSvc := service.NewEmailService()
	userService := service.NewAuthService(userRepo, mailSvc)
	authHandler := handler.NewAuthHandler(userService)

	mux := http.NewServeMux()
	SetupRoutes(mux, authHandler)
	return mux
}
