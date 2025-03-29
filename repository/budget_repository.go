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
	ForceDeleteBudget(userID, budgetID uint) error
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
	return r.db.Preload("User").Preload("Wallet").Preload("Category").First(budget, budget.ID).Error
}

func (r *budgetRepository) GetAllBudgets(userID uint) ([]models.Budget, error) {
	var budgets []models.Budget
	err := r.db.Preload("User").Preload("Wallet").Preload("Category").Where("user_id = ?", userID).Order("created_at DESC").Find(&budgets).Error
	return budgets, err
}

func (r *budgetRepository) GetBudgetByID(userID, budgetID uint) (*models.Budget, error) {
	var budget models.Budget
	err := r.db.Preload("User").Preload("Wallet").Preload("Category").Where("id = ? AND user_id = ?", budgetID, userID).First(&budget).Error
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

func (r *budgetRepository) ForceDeleteBudget(userID, budgetID uint) error {
	return r.db.Unscoped().Where("id = ? AND user_id = ?", budgetID, userID).Delete(&models.Budget{}).Error
}