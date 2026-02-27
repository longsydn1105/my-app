package interfaces

type EmailServiceInterface interface {
	SendWelcomeToMail(toEmail, name string) error
}
