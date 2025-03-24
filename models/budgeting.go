package models

import "time"

type Budgeting struct {
	ID           uint        `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID       uint        `json:"user_id" gorm:"index"`
	User         User        `json:"user" gorm:"foreignKey:UserID"`
	WalletID     uint        `json:"wallet_id" gorm:"index"`
	Wallet       Wallet      `json:"wallet" gorm:"foreignKey:WalletID"`
	CategoryID   uint        `json:"category_id" gorm:"index"`
	Category     Category    `json:"category" gorm:"foreignKey:CategoryID"`
	Amount       float64     `json:"amount"`
	Period       string      `json:"period" gorm:"type:enum('Daily','Weekly','Monthly','Annual')"`
	CreatedAt    time.Time   `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time   `json:"updated_at" gorm:"autoUpdateTime"`
}