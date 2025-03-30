package repository

import (
	"errors"
	"backend-capstone/models"

	"gorm.io/gorm"
)

type GoalSavingRepository interface {
	Create(goalSaving *models.GoalSaving) error
	GetByID(id uint) (*models.GoalSaving, error)
	GetAllByUserID(userID uint) ([]models.GoalSaving, error)
	Update(goalSaving *models.GoalSaving) error
	Delete(id uint) error
}

type goalSavingRepository struct {
	db *gorm.DB
}

func NewGoalSavingRepository(db *gorm.DB) GoalSavingRepository {
	return &goalSavingRepository{db}
}

func (r *goalSavingRepository) Create(goalSaving *models.GoalSaving) error {
	return r.db.Create(goalSaving).Error
}

func (r *goalSavingRepository) GetByID(id uint) (*models.GoalSaving, error) {
	var goalSaving models.GoalSaving
	if err := r.db.Preload("User").Preload("Wallet").First(&goalSaving, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("goal saving tidak ditemukan")
		}
		return nil, err
	}
	return &goalSaving, nil
}

func (r *goalSavingRepository) GetAllByUserID(userID uint) ([]models.GoalSaving, error) {
	var goalSavings []models.GoalSaving
	if err := r.db.Where("user_id = ?", userID).Preload("User").Preload("Wallet").Find(&goalSavings).Error; err != nil {
		return nil, err
	}
	return goalSavings, nil
}

func (r *goalSavingRepository) Update(goalSaving *models.GoalSaving) error {
	return r.db.Save(goalSaving).Error
}

func (r *goalSavingRepository) Delete(id uint) error {
	return r.db.Delete(&models.GoalSaving{}, id).Error
} 