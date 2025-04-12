package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResponseCode string

const (
	Success   ResponseCode = "ZB2000"
	Created   ResponseCode = "ZB2001"
	Retrieved ResponseCode = "ZB2002"
	Updated   ResponseCode = "ZB2003"
	Deleted   ResponseCode = "ZB2004"

	Error_InternalServer     ResponseCode = "ZB4000"
	Error_BadRequest         ResponseCode = "ZB4001"
	Error_Forbidden          ResponseCode = "ZB4003"
	Error_NotFound           ResponseCode = "ZB4004"
	Error_InvalidCreds       ResponseCode = "ZB4005"
	Error_MissingToken       ResponseCode = "ZB4006"
	Error_InvalidTokenFormat ResponseCode = "ZB4007"
	Error_InvalidToken       ResponseCode = "ZB4008"
	Error_ExpiredToken       ResponseCode = "ZB4009"
	Error_Unauthorized      ResponseCode = "ZB4010"

	Error_FailedToCreate        ResponseCode = "ZB5000"
	Error_FailedToRetrieve      ResponseCode = "ZB5001"
	Error_FailedToUpdate        ResponseCode = "ZB5002"
	Error_FailedToDelete        ResponseCode = "ZB5003"
	Error_FailedToGenerateToken ResponseCode = "ZB5004"
	Error_FailedToAddSkill      ResponseCode = "ZB5005"
	Error_FailedToAddDocument   ResponseCode = "ZB5006"
	Error_FailedToAddMember     ResponseCode = "ZB5007"
	Error_FailedToSaveFile      ResponseCode = "ZB5008"
)

var message = map[ResponseCode]string{
	Success:   "Success",
	Created:   "Data Created Successfully",
	Retrieved: "Data Retrieved Successfully",
	Updated:   "Data Updated Successfully",
	Deleted:   "Data Deleted Successfully",

	Error_InternalServer:     "Internal Server Error",
	Error_BadRequest:         "Bad Request or Invalid Payload Data",
	Error_Forbidden:          "You are Prohibited to Access This Resource",
	Error_NotFound:           "Resource Not Found",
	Error_InvalidCreds:       "Invalid Email or Password",
	Error_MissingToken:       "Missing Token",
	Error_InvalidTokenFormat: "Invalid Token Format",
	Error_InvalidToken:       "Invalid Token",
	Error_ExpiredToken:       "Expired Token",
	Error_Unauthorized:      "Unauthorized Access",

	Error_FailedToCreate:        "Failed to Create Data",
	Error_FailedToRetrieve:      "Failed to Retrieve Data",
	Error_FailedToUpdate:        "Failed to Update Data",
	Error_FailedToDelete:        "Failed to Delete Data",
	Error_FailedToGenerateToken: "Failed to Generate Token",
	Error_FailedToAddSkill:      "Failed to Add Skill",
	Error_FailedToAddDocument:   "Failed to Add Document",
	Error_FailedToAddMember:     "Failed to Add Member",
	Error_FailedToSaveFile:      "Failed to Save File",
}

var httpStatus = map[ResponseCode]int{
	Success:   http.StatusOK,
	Created:   http.StatusCreated,
	Retrieved: http.StatusOK,
	Updated:   http.StatusOK,
	Deleted:   http.StatusOK,

	Error_InternalServer:     http.StatusInternalServerError,
	Error_BadRequest:         http.StatusBadRequest,
	Error_Forbidden:          http.StatusForbidden,
	Error_NotFound:           http.StatusNotFound,
	Error_InvalidCreds:       http.StatusBadRequest,
	Error_MissingToken:       http.StatusUnauthorized,
	Error_InvalidTokenFormat: http.StatusBadRequest,
	Error_InvalidToken:       http.StatusUnauthorized,
	Error_ExpiredToken:       http.StatusUnauthorized,
	Error_Unauthorized:      http.StatusUnauthorized,

	Error_FailedToCreate:        http.StatusInternalServerError,
	Error_FailedToRetrieve:      http.StatusInternalServerError,
	Error_FailedToUpdate:        http.StatusInternalServerError,
	Error_FailedToDelete:        http.StatusInternalServerError,
	Error_FailedToGenerateToken: http.StatusInternalServerError,
	Error_FailedToAddSkill:      http.StatusInternalServerError,
	Error_FailedToAddDocument:   http.StatusInternalServerError,
	Error_FailedToAddMember:     http.StatusInternalServerError,
	Error_FailedToSaveFile:      http.StatusInternalServerError,
}

type ResponseError struct {
	Result        any          `json:"result"`
	Success       bool         `json:"success"`
	Code          ResponseCode `json:"code"`
	Message       string       `json:"message"`
	DetailMessage string       `json:"detail_message"`
}

type ResponseSuccess struct {
	Result  any          `json:"result"`
	Success bool         `json:"success"`
	Code    ResponseCode `json:"code"`
	Message string       `json:"message"`
}

type ResponseSuccessWithToken struct {
	Result  any          `json:"result"`
	Success bool         `json:"success"`
	Code    ResponseCode `json:"code"`
	Message string       `json:"message"`
	Token   string       `json:"token"`
}

type IBaseController interface {
	ResponseJSONError(ctx *gin.Context, code ResponseCode, detailMessage string)
	ResponseJSONCreated(ctx *gin.Context, result any)
	ResponseJSONRetrieved(ctx *gin.Context, result any)
	ResponseJSONUpdated(ctx *gin.Context, result any)
	ResponseJSONDeleted(ctx *gin.Context, result any)
	ResponseJSONWithToken(ctx *gin.Context, result any, token string)
}

type BaseController struct{}

func NewBaseController() IBaseController {
	return &BaseController{}
}

func (bc *BaseController) ResponseJSONError(ctx *gin.Context, code ResponseCode, detailMessage string) {
	ctx.JSON(httpStatus[code], ResponseError{
		Result:        nil,
		Success:       false,
		Code:          code,
		Message:       message[code],
		DetailMessage: detailMessage,
	})
}

func (bc *BaseController) ResponseJSONCreated(ctx *gin.Context, result any) {
	ctx.JSON(httpStatus[Created], ResponseSuccess{
		Result:  result,
		Success: true,
		Code:    Created,
		Message: message[Created],
	})
}

func (bc *BaseController) ResponseJSONRetrieved(ctx *gin.Context, result any) {
	ctx.JSON(httpStatus[Retrieved], ResponseSuccess{
		Result:  result,
		Success: true,
		Code:    Retrieved,
		Message: message[Retrieved],
	})
}

func (bc *BaseController) ResponseJSONUpdated(ctx *gin.Context, result any) {
	ctx.JSON(httpStatus[Updated], ResponseSuccess{
		Result:  result,
		Success: true,
		Code:    Updated,
		Message: message[Updated],
	})
}

func (bc *BaseController) ResponseJSONDeleted(ctx *gin.Context, result any) {
	ctx.JSON(httpStatus[Deleted], ResponseSuccess{
		Result:  nil,
		Success: true,
		Code:    Deleted,
		Message: message[Deleted],
	})
}

func (bc *BaseController) ResponseJSONWithToken(ctx *gin.Context, result any, token string) {
	ctx.JSON(httpStatus[Success], ResponseSuccessWithToken{
		Result:  result,
		Success: true,
		Code:    Success,
		Message: message[Success],
		Token:   token,
	})
}
