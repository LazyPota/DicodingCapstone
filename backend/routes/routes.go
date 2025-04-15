package routes

import (
	"backend-capstone/controller"
	"backend-capstone/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitAllRoutes(r *gin.Engine, db *gorm.DB) {
	repository := repository.NewAllRepository(db)
	baseController := controller.NewBaseController()
	controller := controller.NewAllController(repository, db, baseController)

	apiGroup := r.Group("/capstone")

	InitUserRoutes(apiGroup, controller)
	InitCategoryRoutes(apiGroup,controller)
	InitWalletRoutes(apiGroup,controller)
	InitTransactionRoutes(apiGroup,controller)
	InitBudgetRoutes(apiGroup, controller)
	InitGoalSavingRoutes(apiGroup, controller)
	InitFinancialHealthRoutes(apiGroup, controller)

}
