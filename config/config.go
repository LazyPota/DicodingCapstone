package config

import (
	"log"
	"github.com/spf13/viper"
)

type Env struct {
	DSN          string `mapstructure:"DB_DSN"`
	JWTSecretKey string `mapstructure:"JWT_SECRET_KEY"`
}

func NewEnv() *Env {
	env := Env{}
	viper.SetConfigFile(".env")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Can't find the .env file: %v", err)
	}

	if err := viper.Unmarshal(&env); err != nil {
		log.Fatalf("Environment can't be loaded: %v", err)
	}

	return &env
}

