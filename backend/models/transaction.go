package models

import (
	"time"
)

type TransactionType string

const (
	TransactionIncome   TransactionType = "Income"
	TransactionExpense  TransactionType = "Expense"
	TransactionTransfer TransactionType = "Transfer"
)

type Transaction struct {
	ID              uint            `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID          uint            `json:"user_id" gorm:"index;not null"`
	User            User            `json:"user" gorm:"foreignKey:UserID"`
	WalletID        uint            `json:"wallet_id" gorm:"index;not null"`
	Wallet          Wallet          `json:"wallet" gorm:"foreignKey:WalletID"`
	CategoryID      *uint           `json:"category_id" gorm:"index"`
	Category        *Category       `json:"category" gorm:"foreignKey:CategoryID"`
	TransactionType TransactionType `json:"transaction_type" gorm:"type:ENUM('Income','Expense','Transfer');not null"`
	Amount          float64         `json:"amount" gorm:"not null"`
	TransactionDate CustomTime      `json:"transaction_date" gorm:"not null"`
	Note            *string         `json:"note"`
	Transfer        []Transfer      `json:"transfer" gorm:"foreignKey:TransactionID;references:ID"`
	CreatedAt       time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt       time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
}
