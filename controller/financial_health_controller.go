package controller

import (
	"backend-capstone/models"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FinancialHealthController struct {
	DB             *gorm.DB
	BaseController IBaseController
}

type FinancialHealthResponse struct {
	TotalIncome            float64 `json:"total_income"`
	TotalExpense           float64 `json:"total_expense"`
	TotalBudget            float64 `json:"total_budget"`
	TotalSavings           float64 `json:"total_savings"`
	FinancialHealthStatus  string  `json:"financial_health_status"`
}

func NewFinancialHealthController(db *gorm.DB, bc IBaseController) *FinancialHealthController {
	return &FinancialHealthController{
		DB:             db,
		BaseController: bc,
	}
}

func (fc *FinancialHealthController) GetFinancialHealth(c *gin.Context) {
	var totalIncome, totalExpense, totalBudget, totalSavings float64

	errIncome := fc.DB.Model(&models.Transaction{}).
    	Where("transaction_type = ?", models.Income).
    	Select("COALESCE(SUM(amount), 0)").Scan(&totalIncome).Error

	errExpense := fc.DB.Model(&models.Transaction{}).
	    Where("transaction_type = ?", models.Expense).
	    Select("COALESCE(SUM(amount), 0)").Scan(&totalExpense).Error

	errBudget := fc.DB.Model(&models.Budget{}).
		Select("COALESCE(SUM(amount), 0)").Scan(&totalBudget).Error

	errSaving := fc.DB.Model(&models.GoalSaving{}).
		Select("COALESCE(SUM(current_amount), 0)").Scan(&totalSavings).Error

	if errIncome != nil || errExpense != nil || errBudget != nil || errSaving != nil {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "Failed to retrieve financial data")
		return
	}

	if totalIncome == 0 && totalExpense == 0 && totalBudget == 0 && totalSavings == 0 {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "No financial data found")
		return
	}

	inputData := map[string]interface{}{
		"input_data": []float64{totalIncome, totalExpense, totalBudget, totalSavings},
	}

	jsonData, _ := json.Marshal(inputData)

	resp, err := http.Post("http://127.0.0.1:8000/predict", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "Failed to request ML model")
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "Failed to read ML response")
		return
	}

	if resp.StatusCode != http.StatusOK {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "ML model responded with error: "+string(body))
		return
	}

	var prediction struct {
		Result []int `json:"result"`
	}
	if err := json.Unmarshal(body, &prediction); err != nil {
		fc.BaseController.ResponseJSONError(c, Error_FailedToRetrieve, "Failed to parse ML model response")
		return
	}


	status := prediction.Result[0]

	c.JSON(http.StatusOK, gin.H{
		"financial_health_status": status,
		"total_income":            totalIncome,
		"total_expense":           totalExpense,
		"total_budget":            totalBudget,
		"total_savings":           totalSavings,
	})
}

