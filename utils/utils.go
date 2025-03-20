package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}


func HandleValidation[T any](ctx *gin.Context, req *T, responseFunc func(*gin.Context, string, error)) bool {
	if err := ctx.ShouldBindJSON(req); err != nil {
		message := "invalid request payload"
		responseFunc(ctx, "ValidationError", errors.New(message))
		return false
	}
	return true
}
