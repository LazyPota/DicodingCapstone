package routes

import (
	"backend-capstone/controller"

	"github.com/gin-gonic/gin"
)

func InitTransactionRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	transactionGroup := r.Group("/user/:id/transactions")
	{
		transactionGroup.GET("/", ctrl.TransactionController.GetAllTransactions)
		transactionGroup.GET("/:transaction_id", ctrl.TransactionController.GetTransactionByID)
		transactionGroup.POST("/", ctrl.TransactionController.CreateTransaction)
		transactionGroup.PUT("/:transaction_id", ctrl.TransactionController.UpdateTransaction)
		transactionGroup.DELETE("/:transaction_id", ctrl.TransactionController.DeleteTransaction)
	}
}
