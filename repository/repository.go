package repository

import "gorm.io/gorm"

type AllRepository struct {
	UserRepository     UserRepository
	CategoryRepository CategoryRepository
	WalletRepository   WalletRepository
}

func NewAllRepository(db *gorm.DB) *AllRepository {
	return &AllRepository{
		UserRepository:     NewUserRepository(db),
		CategoryRepository: NewCategoryRepository(db),
		WalletRepository:   NewWalletRepository(db),
	}
}
