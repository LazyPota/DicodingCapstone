package models

import (
	"time"
)

type CategoryType string

const (
	Income  CategoryType = "Income"
	Expense CategoryType = "Expense"
)

type Category struct {
	ID           uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID       uint           `json:"user_id" gorm:"index;not null"`
	User         User           `json:"user" gorm:"foreignKey:UserID"`
	CategoryName string         `json:"category_name" gorm:"not null"`
	CategoryType CategoryType   `json:"category_type" gorm:"type:ENUM('Income','Expense');not null"`
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
}
