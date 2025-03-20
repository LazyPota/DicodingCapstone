package controller

import "backend-capstone/repository"

type AllController struct {
	UserController           *UserController
}

func NewAllController(repo *repository.AllRepository) *AllController {
	return &AllController{
		UserController:           NewUserController(repo.UserRepository),
	}
}
