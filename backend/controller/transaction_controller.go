package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"bytes"
	"io"
	"log"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type TransactionController struct {
	transactionRepo repository.TransactionRepository
	transferRepo    repository.TransferRepository
	walletRepo      repository.WalletRepository
	goalSavingRepo  repository.GoalSavingRepository
	budgetRepo      repository.BudgetRepository
	baseController  IBaseController
}

func NewTransactionController(
	transactionRepo repository.TransactionRepository,
	transferRepo repository.TransferRepository,
	walletRepo repository.WalletRepository,
	goalSavingRepo repository.GoalSavingRepository,
	budgetRepo repository.BudgetRepository,
) *TransactionController {
	return &TransactionController{
		transactionRepo: transactionRepo,
		transferRepo:    transferRepo,
		walletRepo:      walletRepo,
		goalSavingRepo:  goalSavingRepo,
		budgetRepo:      budgetRepo,
		baseController:  NewBaseController(),
	}
}

type createTransactionRequest struct {
	WalletID        uint                   `json:"wallet_id" binding:"required"`
	CategoryID      uint                   `json:"category_id" binding:"required"`
	TransactionType models.TransactionType `json:"transaction_type" binding:"required"`
	Amount          float64                `json:"amount" binding:"required"`
	TransactionDate models.CustomTime      `json:"transaction_date" binding:"required"`
	Note            *string                `json:"note"`
}

type updateTransactionRequest struct {
	WalletID        uint                   `json:"wallet_id"`
	CategoryID      uint                   `json:"category_id"`
	TransactionType models.TransactionType `json:"transaction_type"`
	Amount          float64                `json:"amount"`
	TransactionDate models.CustomTime      `json:"transaction_date"`
	Note            *string                `json:"note"`
}

type createTransferRequest struct {
	FromWalletID *uint             `json:"from_wallet_id"`
	FromGoalID   *uint             `json:"from_goal_id"`
	ToWalletID   *uint             `json:"to_wallet_id"`
	ToGoalID     *uint             `json:"to_goal_id"`
	Amount       float64           `json:"amount" binding:"required"`
	TransferDate models.CustomTime `json:"transfer_date" binding:"required"`
	Note         *string           `json:"note"`
}

func (c *TransactionController) CreateTransaction(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)

	var req createTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
		return
	}

	if (req.TransactionType == models.TransactionIncome || req.TransactionType == models.TransactionExpense) && req.CategoryID == 0 {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Category ID wajib diisi untuk tipe transaksi Income atau Expense")
		return
	}

	var categoryID *uint
	if req.TransactionType != models.TransactionTransfer {
		categoryIDValue := req.CategoryID
		categoryID = &categoryIDValue
	}

	transaction := models.Transaction{
		UserID:          uint(userID),
		WalletID:        req.WalletID,
		CategoryID:      categoryID,
		TransactionType: req.TransactionType,
		Amount:          req.Amount,
		TransactionDate: req.TransactionDate,
		Note:            req.Note,
	}

	if err := c.transactionRepo.CreateTransaction(&transaction); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	wallet, err := c.walletRepo.GetWalletByID(uint(userID), req.WalletID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet not found")
		return
	}

	if transaction.TransactionType == models.TransactionExpense {
		if wallet.Amount < transaction.Amount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Insufficient wallet amount")
			return
		}
		wallet.Amount -= transaction.Amount
	} else if transaction.TransactionType == models.TransactionIncome {
		wallet.Amount += transaction.Amount
	}

	if err := c.walletRepo.UpdateWallet(uint(userID), req.WalletID, wallet); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Failed to update wallet")
		return
	}

	if transaction.TransactionType == models.TransactionExpense && categoryID != nil {
		budgets, err := c.budgetRepo.GetBudgetsByCategoryID(uint(userID), *categoryID)
		if err == nil && len(budgets) > 0 {
			for _, budget := range budgets {
				if isTransactionInBudgetPeriod(&transaction, &budget) {
					break
				}
			}
		}
	}

	c.baseController.ResponseJSONCreated(ctx, transaction)
}

func isTransactionInBudgetPeriod(transaction *models.Transaction, budget *models.Budget) bool {
	if budget.Period == models.Daily {
		transactionDate := transaction.TransactionDate.Time
		today := time.Now()
		return transactionDate.Day() == today.Day() &&
			transactionDate.Month() == today.Month() &&
			transactionDate.Year() == today.Year()
	}

	transactionDate := transaction.TransactionDate.Time
	return transactionDate.After(budget.StartDate.Time) &&
		transactionDate.Before(budget.EndDate.Time) ||
		transactionDate.Equal(budget.StartDate.Time) ||
		transactionDate.Equal(budget.EndDate.Time)
}

func (c *TransactionController) GetAllTransactions(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid user ID")
		return
	}

	monthStr := ctx.Query("month")
	yearStr := ctx.Query("year")

	if monthStr != "" && yearStr != "" {
		c.GetTransactionsByMonthYear(ctx)
		return
	}

	tokenUserID, exist := ctx.Get("user_id")
	if !exist || tokenUserID.(uint) != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_Forbidden, "You don't have access to this resource")
		return
	}

	transactions, err := c.transactionRepo.GetAllTransactions(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, "Failed to get transactions: "+err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, transactions)
}

func (c *TransactionController) GetTransactionByID(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transactionID, _ := strconv.ParseUint(ctx.Param("transaction_id"), 10, 64)

	transaction, err := c.transactionRepo.GetTransactionByID(uint(userID), uint(transactionID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Transaction not found")
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, transaction)
}

func (c *TransactionController) UpdateTransaction(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transactionID, _ := strconv.ParseUint(ctx.Param("transaction_id"), 10, 64)

	var req updateTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
		return
	}

	transaction, err := c.transactionRepo.GetTransactionByID(uint(userID), uint(transactionID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Transaction not found")
		return
	}

	oldCategoryID := transaction.CategoryID
	oldTransactionType := transaction.TransactionType
	oldAmount := transaction.Amount
	oldTransactionDate := transaction.TransactionDate

	if req.WalletID != 0 {
		transaction.WalletID = req.WalletID
	}

	if req.CategoryID != 0 {
		if transaction.TransactionType == models.TransactionTransfer ||
			(req.TransactionType != "" && req.TransactionType == models.TransactionTransfer) {
			transaction.CategoryID = nil
		} else {
			categoryIDValue := req.CategoryID
			transaction.CategoryID = &categoryIDValue
		}
	} else if req.TransactionType != "" && req.TransactionType == models.TransactionTransfer {
		transaction.CategoryID = nil
	}

	if req.TransactionType != "" {
		transaction.TransactionType = req.TransactionType
	}

	if req.Amount != 0 {
		transaction.Amount = req.Amount
	}

	if !req.TransactionDate.Time.IsZero() {
		transaction.TransactionDate = req.TransactionDate
	}

	if req.Note != nil {
		transaction.Note = req.Note
	}

	if (transaction.TransactionType == models.TransactionIncome ||
		transaction.TransactionType == models.TransactionExpense) &&
		(transaction.CategoryID == nil) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Category ID wajib diisi untuk tipe transaksi Income atau Expense")
		return
	}

	if err := c.transactionRepo.UpdateTransaction(uint(userID), uint(transactionID), transaction); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	var oldCategoryIDValue uint
	if oldCategoryID != nil {
		oldCategoryIDValue = *oldCategoryID
	}

	var newCategoryIDValue uint
	if transaction.CategoryID != nil {
		newCategoryIDValue = *transaction.CategoryID
	}

	if newCategoryIDValue != oldCategoryIDValue ||
		transaction.TransactionType != oldTransactionType ||
		transaction.Amount != oldAmount ||
		transaction.TransactionDate.Time != oldTransactionDate.Time {
	}

	c.baseController.ResponseJSONUpdated(ctx, transaction)
}

func (c *TransactionController) DeleteTransaction(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transactionID, _ := strconv.ParseUint(ctx.Param("transaction_id"), 10, 64)

	transaction, err := c.transactionRepo.GetTransactionByID(uint(userID), uint(transactionID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Transaction not found")
		return
	}

	if err := c.transactionRepo.DeleteTransaction(uint(userID), uint(transactionID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	if transaction.TransactionType == models.TransactionExpense {
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}

//TRANSFER SECTION

func (c *TransactionController) CreateTransfer(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	bodyBytes, _ := io.ReadAll(ctx.Request.Body)
	ctx.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	log.Printf("[Handler %s] Raw Request Body: %s", ctx.FullPath(), string(bodyBytes))

	var req createTransferRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Printf("[Handler %s] JSON Binding Error: %v", ctx.FullPath(), err)
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
		return
	}

	log.Printf("[Handler %s] Request Body Bound: %+v", ctx.FullPath(), req)

	if (req.FromWalletID == nil && req.FromGoalID == nil) || (req.ToWalletID == nil && req.ToGoalID == nil) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Harus ada sumber dan tujuan transfer")
		return
	}

	if (req.FromWalletID != nil && req.FromGoalID != nil) || (req.ToWalletID != nil && req.ToGoalID != nil) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Tidak bisa menggunakan wallet dan goal sekaligus sebagai sumber atau tujuan")
		return
	}

	var transferType models.TransferType
	var fromWalletID, toWalletID uint

	if req.FromWalletID != nil && req.ToWalletID != nil {
		if *req.FromWalletID == *req.ToWalletID {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Tidak bisa transfer ke wallet yang sama")
			return
		}

		transferType = models.TransferWalletToWallet
		fromWalletID = *req.FromWalletID
		toWalletID = *req.ToWalletID

		fromWallet, err := c.walletRepo.GetWalletByID(uint(userID), fromWalletID)
		if err != nil {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet sumber tidak ditemukan")
			return
		}

		if fromWallet.Amount < req.Amount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Saldo wallet tidak cukup")
			return
		}

		toWallet, err := c.walletRepo.GetWalletByID(uint(userID), toWalletID)
		if err != nil {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet tujuan tidak ditemukan")
			return
		}

		fromWallet.Amount -= req.Amount
		if err := c.walletRepo.UpdateWallet(uint(userID), fromWallet.ID, fromWallet); err != nil {
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate wallet sumber")
			return
		}

		toWallet.Amount += req.Amount
		if err := c.walletRepo.UpdateWallet(uint(userID), toWallet.ID, toWallet); err != nil {
			fromWallet.Amount += req.Amount
			c.walletRepo.UpdateWallet(uint(userID), fromWallet.ID, fromWallet)
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate wallet tujuan")
			return
		}

	} else if req.FromWalletID != nil && req.ToGoalID != nil {
		transferType = models.TransferWalletToGoal
		fromWalletID = *req.FromWalletID

		fromWallet, err := c.walletRepo.GetWalletByID(uint(userID), fromWalletID)
		if err != nil {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet sumber tidak ditemukan")
			return
		}

		if fromWallet.Amount < req.Amount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Saldo wallet tidak cukup")
			return
		}

		toGoal, err := c.goalSavingRepo.GetByID(*req.ToGoalID)
		if err != nil || toGoal.UserID != uint(userID) {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving tidak ditemukan")
			return
		}

		if toGoal.CurrentAmount >= toGoal.TargetAmount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Goal saving sudah mencapai target")
			return
		}

		if toGoal.CurrentAmount+req.Amount > toGoal.TargetAmount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Jumlah transfer melebihi target goal saving")
			return
		}

		fromWallet.Amount -= req.Amount
		if err := c.walletRepo.UpdateWallet(uint(userID), fromWallet.ID, fromWallet); err != nil {
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate wallet")
			return
		}

		toGoal.CurrentAmount += req.Amount
		if err := c.goalSavingRepo.Update(toGoal); err != nil {
			fromWallet.Amount += req.Amount
			c.walletRepo.UpdateWallet(uint(userID), fromWallet.ID, fromWallet)
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate goal saving")
			return
		}

	} else if req.FromGoalID != nil && req.ToWalletID != nil {
		transferType = models.TransferGoalToWallet
		toWalletID = *req.ToWalletID

		fromGoal, err := c.goalSavingRepo.GetByID(*req.FromGoalID)
		if err != nil || fromGoal.UserID != uint(userID) {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Goal saving tidak ditemukan")
			return
		}

		if fromGoal.CurrentAmount < req.Amount {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Saldo goal tidak cukup")
			return
		}

		toWallet, err := c.walletRepo.GetWalletByID(uint(userID), toWalletID)
		if err != nil {
			c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet tujuan tidak ditemukan")
			return
		}

		fromGoal.CurrentAmount -= req.Amount
		if err := c.goalSavingRepo.Update(fromGoal); err != nil {
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate goal saving")
			return
		}

		toWallet.Amount += req.Amount
		if err := c.walletRepo.UpdateWallet(uint(userID), toWallet.ID, toWallet); err != nil {
			fromGoal.CurrentAmount += req.Amount
			c.goalSavingRepo.Update(fromGoal)
			c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Gagal mengupdate wallet tujuan")
			return
		}
	} else {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Sumber dan tujuan transfer tidak valid")
		return
	}

	transfer := models.Transfer{
		UserID:       uint(userID),
		FromWalletID: req.FromWalletID,
		FromGoalID:   req.FromGoalID,
		ToWalletID:   req.ToWalletID,
		ToGoalID:     req.ToGoalID,
		TransferType: transferType,
		Amount:       req.Amount,
		TransferDate: req.TransferDate,
		Note:         req.Note,
	}

	createTransaction := ctx.Query("create_transaction") == "true"

	if createTransaction {
		transaction := models.Transaction{
			UserID:          uint(userID),
			WalletID:        fromWalletID,
			CategoryID:      nil,
			TransactionType: models.TransactionTransfer,
			Amount:          req.Amount,
			TransactionDate: req.TransferDate,
			Note:            req.Note,
		}

		if err := c.transferRepo.CreateTransferWithTransaction(&transfer, &transaction); err != nil {
			c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
			return
		}
	} else {
		if err := c.transferRepo.CreateTransfer(&transfer); err != nil {
			c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
			return
		}
	}

	c.baseController.ResponseJSONCreated(ctx, transfer)
}

func (c *TransactionController) GetAllTransfers(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)

	transfers, err := c.transferRepo.GetAllTransfers(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, transfers)
}

func (c *TransactionController) GetTransferByID(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transferID, _ := strconv.ParseUint(ctx.Param("transfer_id"), 10, 64)

	transfer, err := c.transferRepo.GetTransferByID(uint(userID), uint(transferID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Transfer tidak ditemukan")
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, transfer)
}

func (c *TransactionController) DeleteTransfer(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transferID, _ := strconv.ParseUint(ctx.Param("transfer_id"), 10, 64)

	if _, err := c.transferRepo.GetTransferByID(uint(userID), uint(transferID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Transfer tidak ditemukan")
		return
	}

	if err := c.transferRepo.DeleteTransfer(uint(userID), uint(transferID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}

func (c *TransactionController) GetTransactionsByMonthYear(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 64)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid user ID")
		return
	}

	monthStr := ctx.Query("month")
	yearStr := ctx.Query("year")

	if monthStr == "" || yearStr == "" {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Month and year parameters are required")
		return
	}

	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid month parameter. Must be between 1-12")
		return
	}

	year, err := strconv.Atoi(yearStr)
	if err != nil || year < 1970 {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid year parameter")
		return
	}

	tokenUserID, exist := ctx.Get("user_id")
	if !exist || tokenUserID.(uint) != uint(userID) {
		c.baseController.ResponseJSONError(ctx, Error_Forbidden, "You don't have access to this resource")
		return
	}

	transactions, err := c.transactionRepo.GetTransactionsByMonthYear(uint(userID), month, year)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, "Failed to get transactions: "+err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, transactions)
}
