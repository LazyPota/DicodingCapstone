package main

import (
	"backend-capstone/config"
	"backend-capstone/routes"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db := config.ConnectToDatabase()
	config.MigrateDatabase(db)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.InitAllRoutes(r, db)

	fmt.Println("Server is running on port 8000")
	if err := r.Run(":8000"); err != nil {
		fmt.Println("Server Failed to Start:", err.Error())
	}
}
