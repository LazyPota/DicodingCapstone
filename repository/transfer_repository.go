package repository

import (
	"backend-capstone/models"
	"gorm.io/gorm"
)

type TransferRepository interface {
	CreateTransfer(transfer *models.Transfer) error
	CreateTransferWithTransaction(transfer *models.Transfer, transaction *models.Transaction) error
	GetAllTransfers(userID uint) ([]models.Transfer, error)
	GetTransferByID(userID, transferID uint) (*models.Transfer, error)
	UpdateTransfer(userID, transferID uint, transfer *models.Transfer) error
	DeleteTransfer(userID, transferID uint) error
}

type transferRepository struct {
	db *gorm.DB
}

func NewTransferRepository(db *gorm.DB) TransferRepository {
	return &transferRepository{db: db}
}

func (r *transferRepository) CreateTransfer(transfer *models.Transfer) error {
	err := r.db.Create(transfer).Error
	if err != nil {
		return err
	}
	return r.preloadTransfer(r.db).
		First(transfer, transfer.ID).Error
}

func (r *transferRepository) CreateTransferWithTransaction(transfer *models.Transfer, transaction *models.Transaction) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(transaction).Error; err != nil {
			return err
		}
		
		transfer.TransactionID = &transaction.ID
		
		if err := tx.Create(transfer).Error; err != nil {
			return err
		}
		
		return r.preloadTransfer(tx).First(transfer, transfer.ID).Error
	})
}

func (r *transferRepository) GetAllTransfers(userID uint) ([]models.Transfer, error) {
	var transfers []models.Transfer
	err := r.preloadTransfer(r.db).
		Where("user_id = ?", userID).Order("created_at DESC").
		Find(&transfers).Error
	return transfers, err
}

func (r *transferRepository) GetTransferByID(userID, transferID uint) (*models.Transfer, error) {
	var transfer models.Transfer
	err := r.preloadTransfer(r.db).
		Where("id = ? AND user_id = ?", transferID, userID).
		First(&transfer).Error
	if err != nil {
		return nil, err
	}
	return &transfer, nil
}

func (r *transferRepository) UpdateTransfer(userID, transferID uint, transfer *models.Transfer) error {
	return r.db.Model(&models.Transfer{}).
		Where("id = ? AND user_id = ?", transferID, userID).
		Updates(transfer).Error
}

func (r *transferRepository) DeleteTransfer(userID, transferID uint) error {
	return r.db.Where("id = ? AND user_id = ?", transferID, userID).Delete(&models.Transfer{}).Error
}

func (r *transferRepository) preloadTransfer(tx *gorm.DB) *gorm.DB {
	return tx.
		Preload("User").
		Preload("Transaction").  
		Preload("FromWallet").Preload("FromWallet.User").
		Preload("FromGoal").Preload("FromGoal.User").
		Preload("ToWallet").Preload("ToWallet.User").
		Preload("ToGoal").Preload("ToGoal.User")
}