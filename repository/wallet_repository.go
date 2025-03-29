package repository

import (
	"backend-capstone/models"
	"gorm.io/gorm"
)

type WalletRepository interface {
	CreateWallet(wallet *models.Wallet) error
	GetAllWallets(userID uint) ([]models.Wallet, error)
	GetWalletByID(userID, walletID uint) (*models.Wallet, error)
	UpdateWallet(userID, walletID uint, wallet *models.Wallet) error
	DeleteWallet(userID, walletID uint) error
	ForceDeleteWallet(userID, walletID uint) error
}

type walletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

func (r *walletRepository) CreateWallet(wallet *models.Wallet) error {
	err := r.db.Create(wallet).Error
	if err != nil {
		return err
	}
	return r.db.Preload("User").First(wallet, wallet.ID).Error
}

func (r *walletRepository) GetAllWallets(userID uint) ([]models.Wallet, error) {
	var wallets []models.Wallet
	err := r.db.Preload("User").Where("user_id = ?", userID).Order("created_at DESC").Find(&wallets).Error
	return wallets, err
}

func (r *walletRepository) GetWalletByID(userID, walletID uint) (*models.Wallet, error) {
	var wallet models.Wallet
	err := r.db.Preload("User").Where("id = ? AND user_id = ?", walletID, userID).First(&wallet).Error
	if err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (r *walletRepository) UpdateWallet(userID, walletID uint, wallet *models.Wallet) error {
	return r.db.Model(&models.Wallet{}).Where("id = ? AND user_id = ?", walletID, userID).Updates(wallet).Error
}

func (r *walletRepository) DeleteWallet(userID, walletID uint) error {
	return r.db.Where("id = ? AND user_id = ?", walletID, userID).Delete(&models.Wallet{}).Error
}
func (r *walletRepository) ForceDeleteWallet(userID, walletID uint) error {
	return r.db.Unscoped().Where("id = ? AND user_id = ?", walletID, userID).Delete(&models.Wallet{}).Error
}
