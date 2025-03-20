package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userRepo       repository.UserRepository
	baseController IBaseController
}

func NewUserController(userRepo repository.UserRepository) *UserController {
	return &UserController{
		userRepo:       userRepo,
		baseController: NewBaseController(),
	}
}

type createUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type updateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (m *UserController) CreateUser(ctx *gin.Context) {
	var req createUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		m.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		m.baseController.ResponseJSONError(ctx, Error_InternalServer, err.Error())
		return
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := m.userRepo.CreateUser(&user); err != nil {
		m.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	m.baseController.ResponseJSONCreated(ctx, user)
}

func (m *UserController) GetAllUser(ctx *gin.Context) {
	users, err := m.userRepo.GetAllUser()
	if err != nil {
		m.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	m.baseController.ResponseJSONRetrieved(ctx, users)
}

func (m *UserController) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := m.userRepo.GetUserByID(userID)
	if err != nil {
		m.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	m.baseController.ResponseJSONRetrieved(ctx, user)
}

func (m *UserController) UpdateUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := m.userRepo.GetUserByID(userID)
	if err != nil {
		m.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	var req updateUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		m.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.Username != "" {
		user.Username = req.Username
	}

	if req.Email != "" {
		user.Email = req.Email
	}

	if req.Password != "" {
		user.Password = req.Password
	}

	if err := m.userRepo.UpdateUser(userID, user); err != nil {
		m.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	m.baseController.ResponseJSONUpdated(ctx, user)
}

func (m *UserController) DeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	if err := m.userRepo.DeleteUser(userID); err != nil {
		m.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	m.baseController.ResponseJSONDeleted(ctx, nil)
}
