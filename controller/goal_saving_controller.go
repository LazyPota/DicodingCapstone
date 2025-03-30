package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type GoalSavingController struct {
	goalSavingRepo repository.GoalSavingRepository
	baseController IBaseController
}

func NewGoalSavingController(goalSavingRepo repository.GoalSavingRepository) *GoalSavingController {
	return &GoalSavingController{
		goalSavingRepo:  goalSavingRepo,
		baseController: NewBaseController(),
	}
}

type createGoalSavingRequest struct {
	WalletID     uint    `json:"wallet_id" binding:"required"`
	GoalName     string  `json:"goal_name" binding:"required"`
	TargetAmount float64 `json:"target_amount" binding:"required"`
}

type updateGoalSavingRequest struct {
	WalletID      uint    `json:"wallet_id"`
	GoalName      string  `json:"goal_name"`
	TargetAmount  float64 `json:"target_amount"`
	CurrentAmount float64 `json:"current_amount"`
}

func (c *GoalSavingController) GetAllGoalSavings(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	if userIDStr == "" {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "User ID is required")
		return
	}

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	goalSavings, err := c.goalSavingRepo.GetAllByUserID(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, goalSavings)
}

func (c *GoalSavingController) GetGoalSavingByID(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	goalIDStr := ctx.Param("goal_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	goalID, err := strconv.ParseUint(goalIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Goal Saving ID")
		return
	}

	goalSaving, err := c.goalSavingRepo.GetByID(uint(goalID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	if goalSaving.UserID != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, goalSaving)
}

func (c *GoalSavingController) CreateGoalSaving(ctx *gin.Context) {
	var req createGoalSavingRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	userIDStr := ctx.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	goalSaving := models.GoalSaving{
		UserID:       uint(userID),
		WalletID:     req.WalletID,
		GoalName:     req.GoalName,
		TargetAmount: req.TargetAmount,
	}

	if err := c.goalSavingRepo.Create(&goalSaving); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, goalSaving)
}

func (c *GoalSavingController) UpdateGoalSaving(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	goalIDStr := ctx.Param("goal_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	goalID, err := strconv.ParseUint(goalIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Goal Saving ID")
		return
	}

	var req updateGoalSavingRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	goalSaving, err := c.goalSavingRepo.GetByID(uint(goalID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	if goalSaving.UserID != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	if req.WalletID != 0 {
		goalSaving.WalletID = req.WalletID
	}
	if req.GoalName != "" {
		goalSaving.GoalName = req.GoalName
	}
	if req.TargetAmount != 0 {
		goalSaving.TargetAmount = req.TargetAmount
	}
	if req.CurrentAmount != 0 {
		goalSaving.CurrentAmount = req.CurrentAmount
	}

	if err := c.goalSavingRepo.Update(goalSaving); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, goalSaving)
}

func (c *GoalSavingController) DeleteGoalSaving(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	goalIDStr := ctx.Param("goal_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	goalID, err := strconv.ParseUint(goalIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Goal Saving ID")
		return
	}

	goalSaving, err := c.goalSavingRepo.GetByID(uint(goalID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	if goalSaving.UserID != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving not found")
		return
	}

	if err := c.goalSavingRepo.Delete(uint(goalID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
} 