package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	categoryRepo   repository.CategoryRepository
	baseController IBaseController
}

func NewCategoryController(categoryRepo repository.CategoryRepository) *CategoryController {
	return &CategoryController{
		categoryRepo:   categoryRepo,
		baseController: NewBaseController(),
	}
}

type createCategoryRequest struct {
	CategoryName string            `json:"category_name" binding:"required"`
	CategoryType models.CategoryType `json:"category_type" binding:"required"`
}

type updateCategoryRequest struct {
	CategoryName string            `json:"category_name"`
	CategoryType models.CategoryType `json:"category_type"`
}

func (c *CategoryController) GetAllCategories(ctx *gin.Context) {
	idParam := ctx.Param("id") // Ambil parameter mentah
    log.Printf("[GetAllCategories] Received raw ID parameter: '%s'", idParam) // Log parameter mentah

    userID, err := strconv.ParseUint(idParam, 10, 32) // Parse parameter mentah
    if err != nil {
        log.Printf("[GetAllCategories] Error parsing User ID '%s': %v", idParam, err) // Log error parsing
        c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
        return
    }
    log.Printf("[GetAllCategories] Parsed User ID: %d", userID) // Log ID setelah parsing sukses

	categories, err := c.categoryRepo.GetAllCategories(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, categories)
}

func (c *CategoryController) GetCategoryByID(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(ctx.Param("category_id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category ID")
		return
	}

	category, err := c.categoryRepo.GetCategoryByID(uint(userID), uint(categoryID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Category not found")
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, category)
}

func (c *CategoryController) CreateCategory(ctx *gin.Context) {
	var req createCategoryRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return 
	}

	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	if req.CategoryType != models.Income && req.CategoryType != models.Expense {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category Type")
		return
	}

	category := models.Category{
		UserID:       uint(userID),
		CategoryName: req.CategoryName,
		CategoryType: req.CategoryType,
	}

	if err := c.categoryRepo.CreateCategory(&category); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, category)
}

func (c *CategoryController) UpdateCategory(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(ctx.Param("category_id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category ID")
		return
	}

	var req updateCategoryRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	category, err := c.categoryRepo.GetCategoryByID(uint(userID), uint(categoryID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Category not found")
		return
	}

	// Update hanya jika field dikirim (tidak kosong)
	if req.CategoryName != "" {
		category.CategoryName = req.CategoryName
	}

	if req.CategoryType != "" {
		if req.CategoryType != models.Income && req.CategoryType != models.Expense {
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category Type")
			return
		}
		category.CategoryType = req.CategoryType
	}

	if err := c.categoryRepo.UpdateCategory(uint(userID), uint(categoryID), category); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, category)
}

func (c *CategoryController) DeleteCategory(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(ctx.Param("category_id"), 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category ID")
		return
	}

	if err := c.categoryRepo.DeleteCategory(uint(userID), uint(categoryID)); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}

	c.baseController.ResponseJSONDeleted(ctx, nil)
}