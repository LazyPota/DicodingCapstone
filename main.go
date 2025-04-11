package main

import (
	"backend-capstone/config"
	"backend-capstone/routes"
	"fmt"
	"time"
	"log"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)


func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next();
	}
};

func main() {
	
	err := godotenv.Load()
  	if err != nil {
  	  log.Fatal("Error loading .env file")
  	}

	db := config.ConnectToDatabase()
	config.MigrateDatabase(db)

	r := gin.Default()

	r.Use(RequestLogger())

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"}, 
		ExposeHeaders: []string{"Content-Length"}, 
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))

	routes.InitAllRoutes(r, db)

	fmt.Println("Server is running on port 8000")
	if err := r.Run(":8000"); err != nil {
		fmt.Println("Server Failed to Start:", err.Error())
	}
}