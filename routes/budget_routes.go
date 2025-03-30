package routes

import (
	"backend-capstone/controller"

	"github.com/gin-gonic/gin"
)

func InitBudgetRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	budgetGroup := r.Group("/user/:id/budgets") 
	{
		budgetGroup.GET("/", ctrl.BudgetController.GetAllBudgets)
		budgetGroup.GET("/:budget_id", ctrl.BudgetController.GetBudgetByID)
		budgetGroup.POST("/", ctrl.BudgetController.CreateBudget)
		budgetGroup.PUT("/:budget_id", ctrl.BudgetController.UpdateBudget)
		budgetGroup.DELETE("/:budget_id", ctrl.BudgetController.DeleteBudget)
	}
}
