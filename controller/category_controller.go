package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
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
	CategoryName string `json:"category_name" binding:"required"`
	CategoryType string `json:"category_type" binding:"required"`
}

type updateCategoryRequest struct {
	CategoryName string `json:"category_name"`
	CategoryType string `json:"category_type"`
}

func (c *CategoryController) GetAllCategories(ctx *gin.Context) {
	userIDStr := ctx.Param("id") 
	if userIDStr == "" {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "User ID is required")
		return
	}

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categories, err := c.categoryRepo.GetAllCategories(uint(userID))
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}

	c.baseController.ResponseJSONRetrieved(ctx, categories)
}

func (c *CategoryController) GetCategoryByID(ctx *gin.Context) {
	userIDStr := ctx.Param("id") 
	categoryIDStr := ctx.Param("category_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
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

	userIDStr := ctx.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	var categoryType models.CategoryType
	switch req.CategoryType {
	case "Income":
		categoryType = models.Income
	case "Expense":
		categoryType = models.Expense
	default:
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category Type")
		return
	}

	category := models.Category{
		UserID:       uint(userID),
		CategoryName: req.CategoryName,
		CategoryType: categoryType,
	}

	if err := c.categoryRepo.CreateCategory(&category); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	c.baseController.ResponseJSONCreated(ctx, category)
}

func (c *CategoryController) UpdateCategory(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	categoryIDStr := ctx.Param("category_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
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

	if req.CategoryName != "" {
		category.CategoryName = req.CategoryName
	}

	if req.CategoryType != "" {
		switch req.CategoryType {
		case "Income":
			category.CategoryType = models.Income
		case "Expense":
			category.CategoryType = models.Expense
		default:
			c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid Category Type")
			return
		}
	}

	if err := c.categoryRepo.UpdateCategory(uint(userID), uint(categoryID), category); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}

	c.baseController.ResponseJSONUpdated(ctx, category)
}

func (c *CategoryController) DeleteCategory(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	categoryIDStr := ctx.Param("category_id")

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid User ID")
		return
	}

	categoryID, err := strconv.ParseUint(categoryIDStr, 10, 32)
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