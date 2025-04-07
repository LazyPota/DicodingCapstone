package repository

import (
	"backend-capstone/models"
	"fmt"

	"gorm.io/gorm"
)

type BudgetRepository interface {
	CreateBudget(budget *models.Budget) error
	GetAllBudgets(userID uint) ([]models.Budget, error)
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

func (r *budgetRepository) GetAllBudgets(userID uint) ([]models.Budget, error) {
	var budgets []models.Budget
	err := r.db.Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Where("user_id = ?", userID).Order("created_at DESC").Find(&budgets).Error
	return budgets, err
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
