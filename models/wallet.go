package models

import "time"

type Wallet struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	UserID      uint       `json:"user_id" gorm:"index"`
	User        User       `json:"user" gorm:"foreignKey:UserID"`
	WalletName  string     `json:"wallet_name"`
	WalletType  string 	   `json:"wallet_type"`
	Amount      float64    `json:"amount"`
	CreatedAt   time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
}
