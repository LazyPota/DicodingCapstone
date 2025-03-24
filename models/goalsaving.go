package models

import "time"

type GoalSaving struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID        uint      `json:"user_id" gorm:"index;not null"`
	User          User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	WalletID      uint      `json:"wallet_id" gorm:"index;not null"`
	Wallet        Wallet    `json:"wallet" gorm:"foreignKey:WalletID"`
	GoalName      string    `json:"goal_name" gorm:"not null"`
	TargetAmount  float64   `json:"target_amount" gorm:"not null"`
	CurrentAmount float64   `json:"current_amount" gorm:"default:0"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
