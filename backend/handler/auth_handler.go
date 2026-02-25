package handler

import (
	"context"

	"connectrpc.com/connect"
	authv1 "github.com/longdaica/my-app/backend/gen/auth/v1"
	"github.com/longdaica/my-app/backend/gen/auth/v1/authv1connect"
	"github.com/longdaica/my-app/backend/interfaces"
)

type AuthHandler struct {
	authService interfaces.AuthServiceInterface
}

func NewAuthHandler(svc interfaces.AuthServiceInterface) authv1connect.AuthServiceHandler {
	return &AuthHandler{authService: svc}
}

func (h *AuthHandler) Register(
	ctx context.Context,
	req *connect.Request[authv1.RegisterRequest],
) (*connect.Response[authv1.RegisterResponse], error) {
	// Get data safety
	email := req.Msg.GetEmail()
	password := req.Msg.GetPassword()
	name := req.Msg.GetName()

	// Give server to procces
	err := h.authService.RegisterLogic(email, password, name)
	if err != nil {
		// tra ve loi chuan gRPC
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	// Dong goi tra ve
	res := connect.NewResponse(&authv1.RegisterResponse{
		Message: "Register Successful",
	})
	return res, nil
}

func (h *AuthHandler) Login(
	ctx context.Context,
	req *connect.Request[authv1.LoginRequest],
) (*connect.Response[authv1.LoginResponse], error) {
	email := req.Msg.GetEmail()
	password := req.Msg.GetPassword()

	token, err := h.authService.Login(email, password)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&authv1.LoginResponse{
		Token: token,
	})

	return res, nil
}
