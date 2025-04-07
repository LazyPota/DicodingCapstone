package repository

import "gorm.io/gorm"

type AllRepository struct {
	UserRepository        UserRepository
	CategoryRepository    CategoryRepository
	WalletRepository      WalletRepository
	BudgetRepository      BudgetRepository
	GoalSavingRepository  GoalSavingRepository
	TransactionRepository TransactionRepository
	TransferRepository    TransferRepository
}

func NewAllRepository(db *gorm.DB) *AllRepository {
	return &AllRepository{
		UserRepository:        NewUserRepository(db),
		CategoryRepository:    NewCategoryRepository(db),
		WalletRepository:      NewWalletRepository(db),
		BudgetRepository:      NewBudgetRepository(db),
		GoalSavingRepository:  NewGoalSavingRepository(db),
		TransactionRepository: NewTransactionRepository(db),
		TransferRepository:    NewTransferRepository(db),
	}
}
