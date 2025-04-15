package routes

import (
	"backend-capstone/controller"
	"backend-capstone/middleware"

	"github.com/gin-gonic/gin"
)

func InitUserRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {

	authMiddleware := middleware.NewMiddleware()

	r.POST("/send-reset-code", ctrl.UserController.SendResetCode)
	r.POST("/check-code", ctrl.UserController.CheckCode)
	r.POST("/reset-password", ctrl.UserController.ResetPassword)

	r.POST("/user/login", ctrl.UserController.Login)
	r.POST("/user/register", ctrl.UserController.CreateUser)

	userGroup := r.Group("/user",  authMiddleware.AuthMiddleware())
	{
		userGroup.GET("/", ctrl.UserController.GetAllUser)
		userGroup.GET("/:id", ctrl.UserController.GetUserByID)
		userGroup.PUT("/profile", ctrl.UserController.UpdateProfile)
		userGroup.PUT("/:id", ctrl.UserController.UpdateUser)
		userGroup.DELETE("/:id", ctrl.UserController.DeleteUser)
		userGroup.DELETE("/:id/force", ctrl.UserController.ForceDeleteUser)
	}
}
