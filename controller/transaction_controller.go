package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TransactionController struct {
	transactionRepo repository.TransactionRepository
	baseController  IBaseController
}

func NewTransactionController(transactionRepo repository.TransactionRepository) *TransactionController {
	return &TransactionController{
		transactionRepo: transactionRepo,
		baseController:  NewBaseController(),
	}
}

type createTransactionRequest struct {
	WalletID        uint                   `json:"wallet_id" binding:"required"`
	CategoryID      uint                   `json:"category_id" binding:"required"`
	TransactionType models.TransactionType `json:"transaction_type" binding:"required"`
	Amount          float64                `json:"amount" binding:"required"`
	TransactionDate models.CustomTime      `json:"transaction_date" binding:"required"`
	Note            string                 `json:"note"`
	InputSource     models.InputSourceType `json:"input_source" binding:"required"`
	ReceiptID       *uint                  `json:"receipt_id"`
}

type updateTransactionRequest struct {
	WalletID        uint                   `json:"wallet_id"`
	CategoryID      uint                   `json:"category_id"`
	TransactionType models.TransactionType `json:"transaction_type"`
	Amount          float64                `json:"amount"`
	TransactionDate models.CustomTime      `json:"transaction_date"`
	Note            string                 `json:"note"`
	InputSource     models.InputSourceType `json:"input_source"`
	ReceiptID       *uint                  `json:"receipt_id"`
}

func (c *TransactionController) CreateTransaction(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)

	var req createTransactionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
		return
	}

	transaction := models.Transaction{
		UserID:          uint(userID),
		WalletID:        req.WalletID,
		CategoryID:      req.CategoryID,
		TransactionType: req.TransactionType,
		Amount:          req.Amount,
		TransactionDate: req.TransactionDate,
		Note:            req.Note,
		InputSource:     req.InputSource,
		ReceiptID:       req.ReceiptID,
	}

	if err := c.transactionRepo.CreateTransaction(&transaction); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, transaction)
}

func (c *TransactionController) GetAllTransactions(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)

	transactions, err := c.transactionRepo.GetAllTransactions(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
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

	if req.WalletID != 0 {
		transaction.WalletID = req.WalletID
	}
	if req.CategoryID != 0 {
		transaction.CategoryID = req.CategoryID
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
	if req.Note != "" {
		transaction.Note = req.Note
	}
	if req.InputSource != "" {
		transaction.InputSource = req.InputSource
	}
	if req.ReceiptID != nil {
		transaction.ReceiptID = req.ReceiptID
	}

	if err := c.transactionRepo.UpdateTransaction(uint(userID), uint(transactionID), transaction); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, transaction)
}

func (c *TransactionController) DeleteTransaction(ctx *gin.Context) {
	userID, _ := strconv.ParseUint(ctx.Param("id"), 10, 64)
	transactionID, _ := strconv.ParseUint(ctx.Param("transaction_id"), 10, 64)

	if err := c.transactionRepo.DeleteTransaction(uint(userID), uint(transactionID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}
