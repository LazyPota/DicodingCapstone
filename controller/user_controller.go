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

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (c *UserController) Login(ctx *gin.Context) {
	var req loginRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	user, err := c.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Email not registered")
		return
	}

	if err := utils.CheckPasswordHash(req.Password, user.Password); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InvalidCreds, "Incorrect password")
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to generate token")
		return
	}

	ctx.JSON(200, gin.H{
		"message": "Login successful",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}


func (c *UserController) CreateUser(ctx *gin.Context) {
	var req createUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, err.Error())
		return
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := c.userRepo.CreateUser(&user); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to generate token")
		return
	}

	c.baseController.ResponseJSONCreated(ctx, gin.H{
		"message": "Account created & logged in",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (c *UserController) GetAllUser(ctx *gin.Context) {
	users, err := c.userRepo.GetAllUser()
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, users)
}

func (c *UserController) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := c.userRepo.GetUserByID(userID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, user)
}

func (c *UserController) UpdateUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := c.userRepo.GetUserByID(userID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	var req updateUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
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

	if err := c.userRepo.UpdateUser(userID, user); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, user)
}

func (c *UserController) DeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	if err := c.userRepo.DeleteUser(userID); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}

func (c *UserController) ForceDeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	if err := c.userRepo.ForceDeleteUser(userID); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}
