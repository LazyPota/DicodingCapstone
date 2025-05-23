package main

import (
	"backend-capstone/config"
	"backend-capstone/routes"
	"fmt"
	"time"
	"log"
	"net/http" 
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// RequestLogger bisa dihapus jika tidak digunakan untuk debug aktif
// func RequestLogger() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		// log.Printf("[REQUEST] Method: %s, Path: %s, Origin: %s\n", c.Request.Method, c.Request.URL.Path, c.Request.Header.Get("Origin"))
// 		c.Next();
// 	}
// };

func main() {

	err := godotenv.Load()
  	if err != nil {
  	  log.Fatal("Error loading .env file")
  	}

	db := config.ConnectToDatabase()
	config.MigrateDatabase(db)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

    r.StaticFS("/uploads", http.Dir("./uploads"))
    log.Println("Serving static files from './uploads' at '/uploads'") // Log konfirmasi

	routes.InitAllRoutes(r, db)

	fmt.Println("Server is running on port 8000")
	if err := r.Run(":8000"); err != nil {
		fmt.Println("Server Failed to Start:", err.Error())
	}
}