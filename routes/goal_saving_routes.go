package routes

import (
	"backend-capstone/controller"

	"github.com/gin-gonic/gin"
)

func InitGoalSavingRoutes(r *gin.RouterGroup, ctrl *controller.AllController) {
	goalSavingGroup := r.Group("/user/:id/goal-savings")
	{
		goalSavingGroup.GET("/", ctrl.GoalSavingController.GetAllGoalSavings)
		goalSavingGroup.GET("/:goal_id", ctrl.GoalSavingController.GetGoalSavingByID)
		goalSavingGroup.POST("/", ctrl.GoalSavingController.CreateGoalSaving)
		goalSavingGroup.PUT("/:goal_id", ctrl.GoalSavingController.UpdateGoalSaving)
		goalSavingGroup.DELETE("/:goal_id", ctrl.GoalSavingController.DeleteGoalSaving)
	}
}
