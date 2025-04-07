package controller

import "backend-capstone/repository"

type AllController struct {
	UserController     *UserController
	CategoryController *CategoryController
	WalletController   *WalletController
	BudgetController   *BudgetController
	GoalSavingController   *GoalSavingController
	TransactionController *TransactionController
}

func NewAllController(repo *repository.AllRepository) *AllController {
	return &AllController{
		UserController:     NewUserController(repo.UserRepository),
		CategoryController: NewCategoryController(repo.CategoryRepository),
		WalletController:   NewWalletController(repo.WalletRepository),
		BudgetController:   NewBudgetController(repo.BudgetRepository, repo.TransactionRepository),
		GoalSavingController:   NewGoalSavingController(repo.GoalSavingRepository),
		TransactionController: NewTransactionController(repo.TransactionRepository, repo.TransferRepository, repo.WalletRepository, repo.GoalSavingRepository, repo.BudgetRepository),
	}
}
