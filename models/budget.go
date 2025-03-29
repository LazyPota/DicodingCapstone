package models

import (
	"time"

	"gorm.io/gorm"
)

type BudgetPeriod string

const (
	Daily   BudgetPeriod = "Daily"
	Weekly  BudgetPeriod = "Weekly"
	Monthly BudgetPeriod = "Monthly"
	Annual  BudgetPeriod = "Annual"
)

func (bp BudgetPeriod) IsValid() bool {
	switch bp {
	case Daily, Weekly, Monthly, Annual:
		return true
	}
	return false
}

type Budget struct {
	ID         uint            `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID     uint            `json:"user_id" gorm:"index;not null"`
	User       User            `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	WalletID   uint            `json:"wallet_id" gorm:"index;not null"`
	Wallet     Wallet          `json:"wallet" gorm:"foreignKey:WalletID"`
	CategoryID uint            `json:"category_id" gorm:"index;not null"`
	Category   Category        `json:"category" gorm:"foreignKey:CategoryID"`
	Amount     float64         `json:"amount" gorm:"not null"`
	Period     BudgetPeriod `json:"period" gorm:"type:ENUM('Daily', 'Weekly', 'Monthly', 'Annual');not null"`
	CreatedAt  time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt  `json:"deleted_at" gorm:"index"`
}
