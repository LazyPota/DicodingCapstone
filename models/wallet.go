package models

import (
	"time"
)

type WalletType string

const (
	Cash       WalletType = "Cash"
	Debit     WalletType = "Debit"
	EMoney     WalletType = "E-Money"
	Loan       WalletType = "Loan"
	Investment WalletType = "Investment"
	Other      WalletType = "Other"
)

type Wallet struct {
	ID         uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID     uint           `json:"user_id" gorm:"index;not null"`
	User       User           `json:"user" gorm:"foreignKey:UserID"`
	WalletName string         `json:"wallet_name" gorm:"not null"`
	WalletType WalletType     `json:"wallet_type" gorm:"type:ENUM('Cash','Debit','E-Money','Loan','Investment','Other');not null"`
	Amount     float64        `json:"amount" gorm:"not null"`
	CreatedAt  time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
}
