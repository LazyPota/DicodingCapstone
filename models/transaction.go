package models

import "time"

type TransactionType string
type InputSourceType string

const (
	TransactionIncome  TransactionType = "Income"
	TransactionExpense TransactionType = "Expense"

	InputManual InputSourceType = "Manual"
	InputScan    InputSourceType = "Scan"
)

type Transaction struct {
	ID              uint            `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID          uint            `json:"user_id" gorm:"index;not null"`
	User            User            `json:"user" gorm:"foreignKey:UserID"`
	WalletID        uint            `json:"wallet_id" gorm:"index;not null"`
	Wallet          Wallet          `json:"wallet" gorm:"foreignKey:WalletID"`
	CategoryID      uint            `json:"category_id" gorm:"index;not null"`
	Category        Category        `json:"category" gorm:"foreignKey:CategoryID"`
	TransactionType TransactionType `json:"transaction_type" gorm:"type:ENUM('Income','Expense');not null"`
	Amount          float64         `json:"amount" gorm:"not null"`
	TransactionDate time.Time       `json:"transaction_date" gorm:"not null"`
	Note            string          `json:"note"`
	InputSource     InputSourceType `json:"input_source" gorm:"type:ENUM('Manual','Scan');not null"`
	ReceiptID       *uint           `json:"receipt_id"`
	Receipt         *ScanReceipt    `json:"receipt" gorm:"foreignKey:ReceiptID"`
	CreatedAt       time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt       time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
}
