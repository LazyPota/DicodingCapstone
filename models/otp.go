package models

import (
	"time"
)

type OTP struct {
	ID        uint      `gorm:"primaryKey"`
	Email     string    `gorm:"not null;index"`
	Code      string    `gorm:"not null"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time
}
