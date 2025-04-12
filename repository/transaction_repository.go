package repository

import (
	"backend-capstone/models"
	"log"
	"time"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateTransaction(transaction *models.Transaction) error
	GetAllTransactions(userID uint) ([]models.Transaction, error)
	GetTransactionByID(userID, transactionID uint) (*models.Transaction, error)
	UpdateTransaction(userID, transactionID uint, transaction *models.Transaction) error
	DeleteTransaction(userID, transactionID uint) error
	GetTransactionsByDateAndCategory(userID uint, categoryID uint, date string) ([]models.Transaction, error)
	GetTransactionsByDateRangeAndCategory(userID uint, categoryID uint, startDate string, endDate string) ([]models.Transaction, error)
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
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").
		First(transaction, transaction.ID).Error
}

func (r *transactionRepository) GetAllTransactions(userID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Where("user_id = ?", userID).Order("created_at DESC").
		Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) GetTransactionByID(userID, transactionID uint) (*models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.
		Preload("User").Preload("Wallet").Preload("Wallet.User").Preload("Category").Preload("Category.User").Where("id = ? AND user_id = ?", transactionID, userID).First(&transaction).Error
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

func (r *transactionRepository) GetTransactionsByDateAndCategory(userID uint, categoryID uint, date string) ([]models.Transaction, error) {
	var transactions []models.Transaction
	customTime := &models.CustomTime{}

    parsedTime, err := time.Parse("2006-01-02", date)
    if err != nil {
        log.Printf("[Repo:DateCat] Error parsing date string '%s': %v", date, err)
        return nil, err
    }
    customTime.Time = parsedTime 

	err = r.db.
		Preload("Category"). 
		Where("user_id = ? AND category_id = ? AND DATE(transaction_date) = DATE(?)", userID, categoryID, customTime.Time).
        Where("transaction_type = ?", models.TransactionExpense). 
		Find(&transactions).Error

    log.Printf("[Repo:DateCat] Query finished for UID: %d, CatID: %d, Date: %s. Found: %d, Err: %v", userID, categoryID, date, len(transactions), err) 

	return transactions, err
}

func (r *transactionRepository) GetTransactionsByDateRangeAndCategory(userID uint, categoryID uint, startDate string, endDate string) ([]models.Transaction, error) {
	var transactions []models.Transaction

	startCustomTime := &models.CustomTime{}
    parsedStartTime, err := time.Parse("2006-01-02", startDate)
    if err != nil {
        log.Printf("[Repo:DateRangeCat] Error parsing start date string '%s': %v", startDate, err)
        return nil, err
    }
    startCustomTime.Time = parsedStartTime

	endCustomTime := &models.CustomTime{}
    parsedEndTime, err := time.Parse("2006-01-02", endDate)
     if err != nil {
        log.Printf("[Repo:DateRangeCat] Error parsing end date string '%s': %v", endDate, err)
        return nil, err
    }
    endCustomTime.Time = parsedEndTime
	err = r.db.
		Preload("Category").
		Where("user_id = ? AND category_id = ? AND DATE(transaction_date) BETWEEN DATE(?) AND DATE(?)",
			userID, categoryID, startCustomTime.Time, endCustomTime.Time).
        Where("transaction_type = ?", models.TransactionExpense). 
		Find(&transactions).Error

    log.Printf("[Repo:DateRangeCat] Query finished for UID: %d, CatID: %d, Start: %s, End: %s. Found: %d, Err: %v", userID, categoryID, startDate, endDate, len(transactions), err) 

	return transactions, err
}