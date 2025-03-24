package models

import "time"

type Transaction struct {
	ID               uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID           uint           `json:"user_id" gorm:"index"`
	User             User           `json:"user" gorm:"foreignKey:UserID"`
	WalletID         uint           `json:"wallet_id" gorm:"index"`
	Wallet           Wallet         `json:"wallet" gorm:"foreignKey:WalletID"`
	CategoryID       uint           `json:"category_id" gorm:"index"`
	Category         Category       `json:"category" gorm:"foreignKey:CategoryID"`
	TransactionTyp   string         `json:"transaction_type" gorm:"type:enum('Income','Expense')"`
	Amount           float64        `json:"amount"`
	TransactionDat   time.Time      `json:"transaction_date"`
	Note             string         `json:"note"`
	InputSource      string         `json:"input_source" gorm:"type:enum('manual','ocr')"`
	ReceiptID        *uint          `json:"receipt_id"`
	Receipt          *ScanReceipt   `json:"receipt" gorm:"foreignKey:ReceiptID"`
	CreatedAt        time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
}