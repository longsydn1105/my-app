package interfaces

type AuthServiceInterface interface {
	RegisterLogic(email, password, name string) error
	Login(email, password string) error
}
