package utils

import (
	"backend-capstone/config"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type Claims struct {
	ID       uint   `json:"id"` 
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GetSecretKey() []byte {
	env := config.NewEnv()
	return []byte(env.JWTSecretKey)
}

func GenerateToken(id uint, username string) (string, error) {
	claims := &Claims{
		ID:       id,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(GetSecretKey())
}
