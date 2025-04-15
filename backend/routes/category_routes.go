package routes

import (
	"backend-capstone/controller"
	"backend-capstone/middleware"

	"github.com/gin-gonic/gin"
)

func InitCategoryRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	authMiddleware := middleware.NewMiddleware()

	categoryGroup := r.Group("/user/:id/categories", authMiddleware.AuthMiddleware()) 
	{
		categoryGroup.GET("/", ctrl.CategoryController.GetAllCategories)
		categoryGroup.GET("/:category_id", ctrl.CategoryController.GetCategoryByID)
		categoryGroup.POST("/", ctrl.CategoryController.CreateCategory)
		categoryGroup.PUT("/:category_id", ctrl.CategoryController.UpdateCategory)
		categoryGroup.DELETE("/:category_id", ctrl.CategoryController.DeleteCategory)
	}
}
