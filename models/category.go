package models

import "time"

type Category struct {
	ID             uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID         uint       `json:"user_id" gorm:"index"`
	User           User       `json:"user" gorm:"foreignKey:UserID"`
	CategoryName   string     `json:"category_name"`
	CategoryType   string     `json:"category_type" gorm:"type:enum('Income','Expense')"`
	CreatedAt      time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
}
