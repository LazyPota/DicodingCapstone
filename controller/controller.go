package controller

import "backend-capstone/repository"

type AllController struct {
	UserController     *UserController
	CategoryController *CategoryController
	WalletController   *WalletController
}

func NewAllController(repo *repository.AllRepository) *AllController {
	return &AllController{
		UserController:     NewUserController(repo.UserRepository),
		CategoryController: NewCategoryController(repo.CategoryRepository),
		WalletController:   NewWalletController(repo.WalletRepository),
	}
}
