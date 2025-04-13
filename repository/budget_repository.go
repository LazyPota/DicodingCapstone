package repository

import (
	"backend-capstone/models"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type BudgetRepository interface {
	CreateBudget(budget *models.Budget) error
	GetAllBudgets(userID uint, page, perPage int, month, year int) ([]models.Budget, int64, error)
	GetBudgetByID(userID, budgetID uint) (*models.Budget, error)
	UpdateBudget(userID, budgetID uint, budget *models.Budget) error
	DeleteBudget(userID, budgetID uint) error
	GetBudgetsByCategoryID(userID, categoryID uint) ([]models.Budget, error)
}

type budgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) BudgetRepository {
	return &budgetRepository{db: db}
}

func (r *budgetRepository) CreateBudget(budget *models.Budget) error {
	err := r.db.Create(budget).Error
	if err != nil {
		return err
	}
	return r.db.Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").First(budget, budget.ID).Error
}

func (r *budgetRepository) GetAllBudgets(userID uint, page, perPage int, month, year int) ([]models.Budget, int64, error) {
	var budgets []models.Budget
	var total int64
	query := r.db.Model(&models.Budget{}).Where("user_id = ?", userID)

	if month > 0 && year > 0 {
		startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDate := startDate.AddDate(0, 1, 0).Add(-time.Second)
		
		query = query.Where(
			"(created_at BETWEEN ? AND ?) OR "+
			"(start_date IS NULL) OR "+
			"(start_date <= ? AND end_date >= ?)",
			startDate, endDate, endDate, startDate)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if perPage > 0 && page > 0 {
		offset := (page - 1) * perPage
		query = query.Offset(offset).Limit(perPage)
	}

	err := query.Preload("User").Preload("Wallet").Preload("Wallet.User").
		Preload("Category").Preload("Category.User").
		Order("created_at DESC").Find(&budgets).Error
	
	return budgets, total, err
}

func (r *budgetRepository) GetBudgetByID(userID, budgetID uint) (*models.Budget, error) {
	var budget models.Budget
	err := r.db.Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Where("id = ? AND user_id = ?", budgetID, userID).First(&budget).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("budget not found")
		}
		return nil, err
	}
	return &budget, nil
}

func (r *budgetRepository) UpdateBudget(userID, budgetID uint, budget *models.Budget) error {
	return r.db.Model(&models.Budget{}).Where("id = ? AND user_id = ?", budgetID, userID).Updates(budget).Error
}

func (r *budgetRepository) DeleteBudget(userID, budgetID uint) error {
	return r.db.Where("id = ? AND user_id = ?", budgetID, userID).Delete(&models.Budget{}).Error
}

func (r *budgetRepository) GetBudgetsByCategoryID(userID, categoryID uint) ([]models.Budget, error) {
	var budgets []models.Budget
	err := r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Where("user_id = ? AND category_id = ?", userID, categoryID).
		Order("created_at DESC").
		Find(&budgets).Error

	if err != nil {
		return nil, err
	}

	return budgets, nil
}