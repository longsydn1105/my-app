package cmd

import (
	"net/http"

	"github.com/longdaica/my-app/backend/gen/auth/v1/authv1connect"
)

func SetupRoutes(mux *http.ServeMux, authHandler authv1connect.AuthServiceHandler) {
	path, handler := authv1connect.NewAuthServiceHandler(authHandler)
	mux.Handle(path, handler)
}
