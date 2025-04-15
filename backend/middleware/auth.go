package middleware

import (
	"backend-capstone/config"
	"backend-capstone/controller"
	"backend-capstone/utils"
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Middleware struct {
	baseController controller.IBaseController
}

func NewMiddleware() *Middleware {
	return &Middleware{
		baseController: controller.NewBaseController(),
	}
}

func (m *Middleware) AuthMiddleware() gin.HandlerFunc {
    env := config.NewEnv()
    secretKey := env.JWTSecretKey

	return func(ctx *gin.Context) {
		if secretKey == "" {
			m.baseController.ResponseJSONError(ctx, controller.Error_InternalServer, "Secret key is not configured")
			ctx.Abort()
			return
		}

		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			m.baseController.ResponseJSONError(ctx, controller.Error_MissingToken, "Authorization token is missing")
			ctx.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			m.baseController.ResponseJSONError(ctx, controller.Error_InvalidTokenFormat, "Invalid token format")
			ctx.Abort()
			return
		}
		tokenString := parts[1]

		claims := &utils.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) {
				m.baseController.ResponseJSONError(ctx, controller.Error_ExpiredToken, "Token has expired")
			} else {
				m.baseController.ResponseJSONError(ctx, controller.Error_InvalidToken, "Invalid token")
			}
			ctx.Abort()
			return
		}

		if claims, ok := token.Claims.(*utils.Claims); ok && token.Valid {
			ctx.Set("user_id", claims.ID)
			ctx.Set("username", claims.Username)
		} else {
			m.baseController.ResponseJSONError(ctx, controller.Error_InternalServer, "Failed to parse token claims")
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}
