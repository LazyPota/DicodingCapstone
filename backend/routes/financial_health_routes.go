package routes

import (
	"backend-capstone/controller"
	"backend-capstone/middleware"

	"github.com/gin-gonic/gin"
)

func InitFinancialHealthRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	authMiddleware := middleware.NewMiddleware()

	mlGroup := r.Group("/ml/:id",  authMiddleware.AuthMiddleware())
	{
		mlGroup.POST("/financial-health", ctrl.FinancialHealthController.GetFinancialHealth)
	}
}
