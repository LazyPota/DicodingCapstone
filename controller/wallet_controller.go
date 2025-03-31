package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WalletController struct {
	walletRepo     repository.WalletRepository
	baseController IBaseController
}

func NewWalletController(walletRepo repository.WalletRepository) *WalletController {
	return &WalletController{
		walletRepo:     walletRepo,
		baseController: NewBaseController(),
	}
}

type createWalletRequest struct {
	WalletName string            `json:"wallet_name" binding:"required"`
	WalletType models.WalletType `json:"wallet_type" binding:"required"`
	Amount     float64           `json:"amount" binding:"required"`
}

type updateWalletRequest struct {
	WalletName string            `json:"wallet_name"`
	WalletType models.WalletType `json:"wallet_type"`
	Amount     float64           `json:"amount"`
}

func (c *WalletController) GetAllWallets(ctx *gin.Context) {
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

	wallets, err := c.walletRepo.GetAllWallets(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, wallets)
}

func (c *WalletController) GetWalletByID(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	walletIDStr := ctx.Param("wallet_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	walletID, err := strconv.ParseUint(walletIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Wallet ID")
		return
	}

	wallet, err := c.walletRepo.GetWalletByID(uint(userID), uint(walletID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet not found")
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, wallet)
}

func (c *WalletController) CreateWallet(ctx *gin.Context) {
	var req createWalletRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	wallet := models.Wallet{
		UserID:     uint(userID),
		WalletName: req.WalletName,
		WalletType: req.WalletType,
		Amount:     req.Amount,
	}

	if err := c.walletRepo.CreateWallet(&wallet); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, wallet)
}

func (c *WalletController) UpdateWallet(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	walletID, err := strconv.ParseUint(ctx.Param("wallet_id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Wallet ID")
		return
	}

	var req updateWalletRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
		return
	}

	wallet, err := c.walletRepo.GetWalletByID(uint(userID), uint(walletID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Wallet not found")
		return
	}

	if req.WalletName != "" {
		wallet.WalletName = req.WalletName
	}

	if req.WalletType != "" {
		wallet.WalletType = req.WalletType
	}

	if req.Amount != 0 {
		wallet.Amount = req.Amount
	}

	if err := c.walletRepo.UpdateWallet(uint(userID), uint(walletID), wallet); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, wallet)
}


func (c *WalletController) DeleteWallet(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	walletIDStr := ctx.Param("wallet_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	walletID, err := strconv.ParseUint(walletIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Wallet ID")
		return
	}

	if err := c.walletRepo.DeleteWallet(uint(userID), uint(walletID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}
