package routes

import (
	"backend-capstone/controller"
	"backend-capstone/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitAllRoutes(r *gin.Engine, db *gorm.DB) {
	repository := repository.NewAllRepository(db)
	controller := controller.NewAllController(repository)
	apiGroup := r.Group("/capstone")

	InitUserRoutes(apiGroup, controller)
	InitCategoryRoutes(apiGroup,controller)
	InitWalletRoutes(apiGroup,controller)
	InitTransactionRoutes(apiGroup,controller)
}
