package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BudgetController struct {
	budgetRepo     repository.BudgetRepository
	baseController IBaseController
}

func NewBudgetController(budgetRepo repository.BudgetRepository) *BudgetController {
	return &BudgetController{
		budgetRepo:     budgetRepo,
		baseController: NewBaseController(),
	}
}

type createBudgetRequest struct {
	UserID     uint                `json:"user_id" binding:"required"`
	WalletID   uint                `json:"wallet_id" binding:"required"`
	CategoryID uint                `json:"category_id" binding:"required"`
	Amount     float64             `json:"amount" binding:"required"`
	Period     models.BudgetPeriod `json:"period" binding:"required"`
}

type updateBudgetRequest struct {
	Amount float64            `json:"amount"`
	Period models.BudgetPeriod `json:"period"`
}

func (c *BudgetController) CreateBudget(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	var req createBudgetRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.UserID != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "User ID mismatch")
		return
	}

	if !req.Period.IsValid() {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid budget period")
		return
	}

	budget := models.Budget{
		UserID:     req.UserID,
		WalletID:   req.WalletID,
		CategoryID: req.CategoryID,
		Amount:     req.Amount,
		Period:     req.Period,
	}

	if err := c.budgetRepo.CreateBudget(&budget); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, budget)
}

func (c *BudgetController) GetAllBudgets(ctx *gin.Context) {
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

	budgets, err := c.budgetRepo.GetAllBudgets(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, budgets)
}

func (c *BudgetController) GetBudgetByID(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	budgetIDStr := ctx.Param("budget_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	budgetID, err := strconv.ParseUint(budgetIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Budget ID")
		return
	}

	budget, err := c.budgetRepo.GetBudgetByID(uint(userID), uint(budgetID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, budget)
}

func (c *BudgetController) UpdateBudget(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	budgetIDStr := ctx.Param("budget_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	budgetID, err := strconv.ParseUint(budgetIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Budget ID")
		return
	}

	budget, err := c.budgetRepo.GetBudgetByID(uint(userID), uint(budgetID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	var req updateBudgetRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.Amount != 0 {
		budget.Amount = req.Amount
	}

	if req.Period != "" {
		budget.Period = req.Period
	}

	if err := c.budgetRepo.UpdateBudget(uint(userID), uint(budgetID), budget); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, budget)
}

func (c *BudgetController) DeleteBudget(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	budgetIDStr := ctx.Param("budget_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	budgetID, err := strconv.ParseUint(budgetIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Budget ID")
		return
	}

	if err := c.budgetRepo.DeleteBudget(uint(userID), uint(budgetID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}