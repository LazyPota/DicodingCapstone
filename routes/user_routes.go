package routes

import (
	"backend-capstone/controller"

	"github.com/gin-gonic/gin"
)

func InitUserRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {

	userGroup := r.Group("/user")
	{
		userGroup.GET("/", ctrl.UserController.GetAllUser)
		userGroup.GET("/:id", ctrl.UserController.GetUserByID)
		userGroup.POST("/", ctrl.UserController.CreateUser)
		userGroup.PUT("/:id", ctrl.UserController.UpdateUser)
		userGroup.DELETE("/:id", ctrl.UserController.DeleteUser)
	}
}
