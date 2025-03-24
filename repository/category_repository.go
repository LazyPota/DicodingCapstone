package repository

import (
	"backend-capstone/models"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	CreateCategory(category *models.Category) error
	GetAllCategories(userID uint) ([]models.Category, error)
	GetCategoryByID(userID, categoryID uint) (*models.Category, error)
	UpdateCategory(userID, categoryID uint, category *models.Category) error
	DeleteCategory(userID, categoryID uint) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) CreateCategory(category *models.Category) error {
	err := r.db.Create(category).Error
	if err != nil {
		return err
	}
	return r.db.Preload("User").First(category, category.ID).Error
}


func (r *categoryRepository) GetAllCategories(userID uint) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Preload("User").Where("user_id = ?", userID).Order("created_at DESC").Find(&categories).Error
	return categories, err
}


func (r *categoryRepository) GetCategoryByID(userID, categoryID uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Preload("User").Where("id = ? AND user_id = ?", categoryID, userID).First(&category).Error
	return &category, err
}


func (r *categoryRepository) UpdateCategory(userID, categoryID uint, category *models.Category) error {
	return r.db.Model(&models.Category{}).Where("id = ? AND user_id = ?", categoryID, userID).Updates(category).Error
}

func (r *categoryRepository) DeleteCategory(userID, categoryID uint) error {
	return r.db.Where("id = ? AND user_id = ?", categoryID, userID).Delete(&models.Category{}).Error
}
