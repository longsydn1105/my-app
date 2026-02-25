package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"size:100;uniqueIndex;not null"`
	Password string `gorm:"size:255;not null"`
	Name     string `gorm:"size:100"`
}
