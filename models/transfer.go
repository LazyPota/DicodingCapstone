package models

import (
	"time"
)

type TransferType string

const (
	TransferWalletToWallet   TransferType = "WalletToWallet"
	TransferWalletToGoal     TransferType = "WalletToGoal"
	TransferGoalToWallet     TransferType = "GoalToWallet"
)

type Transfer struct {
	ID             uint         `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID         uint         `json:"user_id" gorm:"index;not null"`
	User           User         `json:"user" gorm:"foreignKey:UserID"`
	FromWalletID   *uint        `json:"from_wallet_id" gorm:"index"`
	FromWallet     *Wallet      `json:"from_wallet" gorm:"foreignKey:FromWalletID"`
	FromGoalID     *uint        `json:"from_goal_id" gorm:"index"`
	FromGoal       *GoalSaving  `json:"from_goal" gorm:"foreignKey:FromGoalID"`
	ToWalletID     *uint        `json:"to_wallet_id" gorm:"index"`
	ToWallet       *Wallet      `json:"to_wallet" gorm:"foreignKey:ToWalletID"`
	ToGoalID       *uint        `json:"to_goal_id" gorm:"index"`
	ToGoal         *GoalSaving  `json:"to_goal" gorm:"foreignKey:ToGoalID"`
	TransferType   TransferType `json:"transfer_type" gorm:"type:ENUM('WalletToWallet','WalletToGoal','GoalToWallet');not null"`
	Amount         float64      `json:"amount" gorm:"not null"`
	TransferDate   CustomTime   `json:"transfer_date" gorm:"not null"`
	Note           *string      `json:"note"`
	CreatedAt      time.Time    `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time    `json:"updated_at" gorm:"autoUpdateTime"`
}