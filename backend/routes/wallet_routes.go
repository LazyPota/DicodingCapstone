package routes

import (
	"backend-capstone/controller"
	"backend-capstone/middleware"

	"github.com/gin-gonic/gin"
)

func InitWalletRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	
	authMiddleware := middleware.NewMiddleware()

	walletGroup := r.Group("/user/:id/wallets", authMiddleware.AuthMiddleware())
	{
		walletGroup.GET("/", ctrl.WalletController.GetAllWallets)
		walletGroup.GET("/:wallet_id", ctrl.WalletController.GetWalletByID)
		walletGroup.POST("/", ctrl.WalletController.CreateWallet)
		walletGroup.PUT("/:wallet_id", ctrl.WalletController.UpdateWallet)
		walletGroup.DELETE("/:wallet_id", ctrl.WalletController.DeleteWallet)
	}
}
