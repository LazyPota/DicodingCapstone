package repository

import "gorm.io/gorm"

type AllRepository struct {
	UserRepository UserRepository
}

func NewAllRepository(db *gorm.DB) *AllRepository {
	return &AllRepository{
		UserRepository: NewUserRepository(db),
	}
}
