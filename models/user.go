package models

import "time"

type User struct {
	ID          uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Username    string     `json:"username" gorm:"unique"`
	Email       string     `json:"email" gorm:"unique"`
	Password    string     `json:"-"`
	CreatedAt   time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
} 
