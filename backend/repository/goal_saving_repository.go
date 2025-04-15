package repository

import (
	"errors"
	"backend-capstone/models"
	"time"

	"gorm.io/gorm"
)

type GoalSavingRepository interface {
	Create(goalSaving *models.GoalSaving) error
	GetByID(id uint) (*models.GoalSaving, error)
	GetAllByUserID(userID uint, page, perPage int, month, year int) ([]models.GoalSaving, int64, error)
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
	if err := r.db.Create(goalSaving).Error; err != nil {
		return err
	}

	return r.db.Preload("User").First(goalSaving, goalSaving.ID).Error
}

func (r *goalSavingRepository) GetByID(id uint) (*models.GoalSaving, error) {
	var goalSaving models.GoalSaving
	if err := r.db.
		Preload("User").First(&goalSaving, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("goal saving tidak ditemukan")
		}
		return nil, err
	}
	return &goalSaving, nil
}

func (r *goalSavingRepository) GetAllByUserID(userID uint, page, perPage int, month, year int) ([]models.GoalSaving, int64, error) {
	var goalSavings []models.GoalSaving
	var total int64
	query := r.db.Model(&models.GoalSaving{}).Where("user_id = ?", userID)

	if month > 0 && year > 0 {
		startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDate := startDate.AddDate(0, 1, 0).Add(-time.Second)
		query = query.Where("created_at >= ? AND created_at <= ?", startDate, endDate)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if perPage > 0 && page > 0 {
		offset := (page - 1) * perPage
		query = query.Offset(offset).Limit(perPage)
	}

	if err := query.Preload("User").Order("created_at DESC").Find(&goalSavings).Error; err != nil {
		return nil, 0, err
	}
	
	return goalSavings, total, nil
}

func (r *goalSavingRepository) Update(goalSaving *models.GoalSaving) error {
	if goalSaving.ID == 0 {
		return errors.New("id goal saving tidak valid")
	}

	if err := r.db.Model(&models.GoalSaving{}).Where("id = ?", goalSaving.ID).Updates(goalSaving).Error; err != nil {
		return err
	}

	return r.db.Preload("User").First(goalSaving, goalSaving.ID).Error
}

func (r *goalSavingRepository) Delete(id uint) error {
	return r.db.Delete(&models.GoalSaving{}, id).Error
}