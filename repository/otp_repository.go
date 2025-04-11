package repository

import (
	"time"

	"gorm.io/gorm"
	"backend-capstone/models"
)

type OTPRepository interface {
	SaveOTP(email, code string) error
	GetLatestOTPByEmail(email string) (*models.OTP, error)
	DeleteOTPByEmail(email string) error
}

type otpRepository struct {
	db *gorm.DB
}

func NewOTPRepository(db *gorm.DB) OTPRepository {
	return &otpRepository{db}
}

func (r *otpRepository) SaveOTP(email, code string) error {
	otp := &models.OTP{
		Email:     email,
		Code:      code,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(5 * time.Minute), 
	}
	return r.db.Create(otp).Error
}

func (r *otpRepository) GetLatestOTPByEmail(email string) (*models.OTP, error) {
	var otp models.OTP
	err := r.db.
		Where("email = ? AND expires_at > ?", email, time.Now()).
		Order("created_at desc").
		First(&otp).Error

	if err != nil {
		return nil, err
	}
	return &otp, nil
}

func (r *otpRepository) DeleteOTPByEmail(email string) error {
	return r.db.Where("email = ?", email).Delete(&models.OTP{}).Error
}
