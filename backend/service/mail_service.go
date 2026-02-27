package service

import (
	"fmt"
	"net/smtp"

	"github.com/longdaica/my-app/backend/interfaces"
)

type emailService struct {
	smtpHost string
	smtpPort string
}

func NewEmailService() interfaces.EmailServiceInterface {
	return &emailService{
		smtpHost: "localhost",
		smtpPort: "1025",
	}
}

func (e *emailService) SendWelcomeToMail(toEmail, name string) error {
	addr := fmt.Sprintf("%s:%s", e.smtpHost, e.smtpPort)

	subject := "Subject: Chào mừng bạn đến với hệ thống!\r\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body := fmt.Sprintf(`
		<h1>Hello %s!</h1>
		<p>Cảm ơn đã đăng ký tài khoản. Hệ thống này được code bởi Long Phùng.</p>
	`, name)

	msg := []byte(subject + mime + body)

	err := smtp.SendMail(addr, nil, "longsydn1105@gmail.com", []string{toEmail}, msg)
	return err
}
