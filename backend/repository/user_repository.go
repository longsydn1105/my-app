package repository

import "gorm.io/gorm"

type userRepo struct {
	db *gorm.DB
}

