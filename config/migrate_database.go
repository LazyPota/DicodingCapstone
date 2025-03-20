package config

import (
	"backend-capstone/models"
	"log"

	"gorm.io/gorm"
)

func MigrateDatabase(db *gorm.DB) {
	if err := db.AutoMigrate(
		&models.User{},
		
	); err != nil {
		log.Fatalf("Failed to migrate the database: %v", err)
	}
	log.Println("Database migration success!")
}
