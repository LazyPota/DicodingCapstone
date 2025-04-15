package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type Pagination struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
}

type BudgetController struct {
	budgetRepo      repository.BudgetRepository
	transactionRepo repository.TransactionRepository
	baseController  IBaseController
}

func NewBudgetController(budgetRepo repository.BudgetRepository, transactionRepo repository.TransactionRepository) *BudgetController {
	return &BudgetController{
		budgetRepo:      budgetRepo,
		transactionRepo: transactionRepo,
		baseController:  NewBaseController(),
	}
}

type createBudgetRequest struct {
	WalletID   uint                `json:"wallet_id" binding:"required"`
	CategoryID uint                `json:"category_id" binding:"required"`
	Amount     float64             `json:"amount" binding:"required"`
	Period     models.BudgetPeriod `json:"period" binding:"required"`
	StartDate  *models.CustomTime  `json:"start_date"`
}

type updateBudgetRequest struct {
	Amount    float64             `json:"amount"`
	Period    models.BudgetPeriod `json:"period"`
	StartDate *models.CustomTime  `json:"start_date"`
}

type budgetsResponse struct {
	Data       []models.Budget `json:"data"`
	Pagination Pagination      `json:"pagination"`
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

	if !req.Period.IsValid() {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid budget period")
		return
	}

	budget := models.Budget{
		UserID:     uint(userID),
		WalletID:   req.WalletID,
		CategoryID: req.CategoryID,
		Amount:     req.Amount,
		Period:     req.Period,
	}

	if req.Period != models.Daily {
		if req.StartDate == nil {
			now := models.CustomTime{Time: time.Now()}
			budget.StartDate = &now
		} else {
			budget.StartDate = req.StartDate
		}

		endTime := budget.StartDate.Time
		switch req.Period {
		case models.Weekly:
			endTime = endTime.AddDate(0, 0, 7)
		case models.Monthly:
			endTime = endTime.AddDate(0, 1, 0)
		case models.Annual:
			endTime = endTime.AddDate(1, 0, 0)
		}
		endDate := models.CustomTime{Time: endTime}
		budget.EndDate = &endDate
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

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(ctx.DefaultQuery("per_page", "10"))

	monthStr := ctx.Query("month")
	yearStr := ctx.Query("year")
	
	month := 0
	year := 0
	
	if monthStr != "" && yearStr != "" {
		month, _ = strconv.Atoi(monthStr)
		year, _ = strconv.Atoi(yearStr)
		
		if month < 1 || month > 12 || year < 2000 || year > time.Now().Year()+1 {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid month or year")
			return
		}
	}

	budgets, total, err := c.budgetRepo.GetAllBudgets(uint(userID), page, perPage, month, year)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	for i := range budgets {
		spentAmount, err := c.calculateBudgetSpending(uint(userID), &budgets[i])
		if err != nil {
			continue
		}
		budgets[i].SpentAmount = spentAmount
	}

	totalPages := int(total) / perPage
	if int(total)%perPage > 0 {
		totalPages++
	}

	response := budgetsResponse{
		Data: budgets,
		Pagination: Pagination{
			CurrentPage: page,
			PerPage:     perPage,
			TotalItems:  total,
			TotalPages:  totalPages,
		},
	}

	c.baseController.ResponseJSONRetrieved(ctx, response)
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

	spentAmount, err := c.calculateBudgetSpending(uint(userID), budget)
	if err == nil {
		budget.SpentAmount = spentAmount
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

	if req.Period != "" && budget.Period != req.Period {
		budget.Period = req.Period
		
		if req.Period == models.Daily {
			budget.StartDate = nil
			budget.EndDate = nil
		} else {
			if req.StartDate != nil {
				budget.StartDate = req.StartDate
			} else if budget.StartDate == nil {
				now := models.CustomTime{Time: time.Now()}
				budget.StartDate = &now
			}

			endTime := budget.StartDate.Time
			switch req.Period {
			case models.Weekly:
				endTime = endTime.AddDate(0, 0, 7)
			case models.Monthly:
				endTime = endTime.AddDate(0, 1, 0)
			case models.Annual:
				endTime = endTime.AddDate(1, 0, 0)
			}
			endDate := models.CustomTime{Time: endTime}
			budget.EndDate = &endDate
		}
	} else if req.StartDate != nil && budget.Period != models.Daily {
		budget.StartDate = req.StartDate
		
		endTime := budget.StartDate.Time
		switch budget.Period {
		case models.Weekly:
			endTime = endTime.AddDate(0, 0, 7)
		case models.Monthly:
			endTime = endTime.AddDate(0, 1, 0)
		case models.Annual:
			endTime = endTime.AddDate(1, 0, 0)
		}
		endDate := models.CustomTime{Time: endTime}
		budget.EndDate = &endDate
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

func (c *BudgetController) calculateBudgetSpending(userID uint, budget *models.Budget) (float64, error) {
	var transactions []models.Transaction
	var err error
    var startDateString, endDateString string

    const dateFormat = "2006-01-02"

    log.Printf("[CalcSpending] Budget ID: %d, CatID: %d, Period: %s, Amount: %.2f",
                budget.ID, budget.CategoryID, budget.Period, budget.Amount)

	if budget.Period == models.Daily {
		today := time.Now().Format(dateFormat) 
		log.Printf("[CalcSpending] Getting Daily transactions for %s", today)
		transactions, err = c.transactionRepo.GetTransactionsByDateAndCategory(userID, budget.CategoryID, today)
	} else {
        if budget.StartDate == nil || budget.EndDate == nil {
             log.Printf("[CalcSpending] Warning: StartDate or EndDate is nil for non-daily budget ID %d", budget.ID)
             return 0, fmt.Errorf("start or end date missing for budget period %s", budget.Period)
        }
        startDateString = budget.StartDate.Time.Format(dateFormat) 
		endDateString = budget.EndDate.Time.Format(dateFormat)   
        log.Printf("[CalcSpending] Getting Ranged transactions from %s to %s", startDateString, endDateString)
		transactions, err = c.transactionRepo.GetTransactionsByDateRangeAndCategory(
			userID,
			budget.CategoryID,
			startDateString, 
			endDateString,   
		)
	}

	if err != nil {
        log.Printf("[CalcSpending] Error getting transactions: %v", err)
		return 0, err
	}

    log.Printf("[CalcSpending] Found %d transactions matching criteria.", len(transactions))

	var totalSpent float64
	for _, transaction := range transactions {
		if transaction.TransactionType == models.TransactionExpense {
            log.Printf("[CalcSpending] Adding expense amount: %.2f (Tx ID: %d)", transaction.Amount, transaction.ID)
			totalSpent += transaction.Amount
		} else {
            log.Printf("[CalcSpending] Skipping non-expense transaction (Type: %s, Tx ID: %d)", transaction.TransactionType, transaction.ID)
        }
	}
    log.Printf("[CalcSpending] Calculated total spent: %.2f", totalSpent)
	return totalSpent, nil
}