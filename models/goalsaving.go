package models

import "time"

type GoalSaving struct {
	ID                    uint        `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID                uint        `json:"user_id" gorm:"index"`
	User                  User        `json:"user" gorm:"foreignKey:UserID"`
	WalletID              uint        `json:"wallet_id" gorm:"index"`
	Wallet                Wallet      `json:"wallet" gorm:"foreignKey:WalletID"`
	GoalName              string      `json:"goal_name"`
	TargetAmount          float64     `json:"target_amount"`
	CurrentAmount         float64     `json:"current_amount"`
	PeriodicSavingAmount  float64     `json:"periodic_saving_amount"`
	CreatedAt             time.Time   `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt             time.Time   `json:"updated_at" gorm:"autoUpdateTime"`
}