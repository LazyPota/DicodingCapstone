package routes

import (
	"backend-capstone/controller"
	"backend-capstone/middleware"

	"github.com/gin-gonic/gin"
)

func InitTransactionRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	authMiddleware := middleware.NewMiddleware()
	
	transactionGroup := r.Group("/user/:id/transactions", authMiddleware.AuthMiddleware())
	{
		transactionGroup.GET("/", ctrl.TransactionController.GetAllTransactions)
		transactionGroup.GET("/:transaction_id", ctrl.TransactionController.GetTransactionByID)
		transactionGroup.POST("/", ctrl.TransactionController.CreateTransaction)
		transactionGroup.PUT("/:transaction_id", ctrl.TransactionController.UpdateTransaction)
		transactionGroup.DELETE("/:transaction_id", ctrl.TransactionController.DeleteTransaction)

		transactionGroup.GET("/transfers", ctrl.TransactionController.GetAllTransfers)
		transactionGroup.GET("/transfers/:transfer_id", ctrl.TransactionController.GetTransferByID)
		transactionGroup.POST("/transfers", ctrl.TransactionController.CreateTransfer)
		transactionGroup.DELETE("/transfers/:transfer_id", ctrl.TransactionController.DeleteTransfer)
	}
}
