package model

import "time"

type RefeshToken struct {
	ID         uint   `gorm:"primaryKey"`
	UserID     uint   `gorm:"index"`
	Token      string `gorm:"uniqueIndex"`
	DeviceID   string
	ExprisesAt time.Time
	CreatedAt  time.Time
}
