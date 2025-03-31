package repository

import (
	"backend-capstone/models"
	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateTransaction(transaction *models.Transaction) error
	GetAllTransactions(userID uint) ([]models.Transaction, error)
	GetTransactionByID(userID, transactionID uint) (*models.Transaction, error)
	UpdateTransaction(userID, transactionID uint, transaction *models.Transaction) error
	DeleteTransaction(userID, transactionID uint) error
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db: db}
}

func (r *transactionRepository) CreateTransaction(transaction *models.Transaction) error {
	err := r.db.Create(transaction).Error
	if err != nil {
		return err
	}
	return r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Preload("Receipt").
		First(transaction, transaction.ID).Error
}

func (r *transactionRepository) GetAllTransactions(userID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Preload("Receipt").Where("user_id = ?", userID).Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) GetTransactionByID(userID, transactionID uint) (*models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Preload("Receipt").Where("id = ? AND user_id = ?", transactionID, userID).First(&transaction).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *transactionRepository) UpdateTransaction(userID, transactionID uint, transaction *models.Transaction) error {
	return r.db.Model(&models.Transaction{}).
		Where("id = ? AND user_id = ?", transactionID, userID).
		Updates(transaction).Error
}

func (r *transactionRepository) DeleteTransaction(userID, transactionID uint) error {
	return r.db.Where("id = ? AND user_id = ?", transactionID, userID).Delete(&models.Transaction{}).Error
}
