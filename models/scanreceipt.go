package models

import "time"

type ScanReceipt struct {
	ID              uint        `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID          uint        `json:"user_id" gorm:"index"`
	User            User        `json:"user" gorm:"foreignKey:UserID"`
	ImageURL        string      `json:"image_url"`
	ExtractedText   string      `json:"extracted_text"`
	CreatedAt       time.Time   `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt       time.Time   `json:"updated_at" gorm:"autoUpdateTime"`
}