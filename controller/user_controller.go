package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

var otpStore = map[string]string{}

type UserController struct {
	userRepo       repository.UserRepository
	otpRepo        repository.OTPRepository
	baseController IBaseController
}

func NewUserController(userRepo repository.UserRepository, otpRepo repository.OTPRepository) *UserController {
	return &UserController{
		userRepo:       userRepo,
		otpRepo:        otpRepo,
		baseController: NewBaseController(),
	}
}

type createUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type updateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type sendResetCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type CodeRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type resetPasswordRequest struct {
	NewPassword        string `json:"new_password" binding:"required"`
	NewPasswordConfirm string `json:"new_password_confirm" binding:"required"`
}

func (c *UserController) Login(ctx *gin.Context) {
	var req loginRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	user, err := c.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Email not registered")
		return
	}

	if err := utils.CheckPasswordHash(req.Password, user.Password); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InvalidCreds, "Incorrect password")
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to generate token")
		return
	}

	ctx.JSON(200, gin.H{
		"message": "Login successful",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var req createUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, err.Error())
		return
	}

	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := c.userRepo.CreateUser(&user); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToCreate, err.Error())
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to generate token")
		return
	}

	c.baseController.ResponseJSONCreated(ctx, gin.H{
		"message": "Account created & logged in",
		"token":   token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (c *UserController) GetAllUser(ctx *gin.Context) {
	users, err := c.userRepo.GetAllUser()
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToRetrieve, err.Error())
		return
	}
	c.baseController.ResponseJSONRetrieved(ctx, users)
}

func (c *UserController) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := c.userRepo.GetUserByID(userID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}
	c.baseController.ResponseJSONRetrieved(ctx, user)
}

func (c *UserController) UpdateUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	user, err := c.userRepo.GetUserByID(userID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	var req updateUserRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Password != "" {
		hashed, err := utils.HashPassword(req.Password)
		if err != nil {
			c.baseController.ResponseJSONError(ctx, Error_InternalServer, err.Error())
			return
		}
		user.Password = string(hashed)
	}

	if err := c.userRepo.UpdateUser(userID, user); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, err.Error())
		return
	}
	c.baseController.ResponseJSONUpdated(ctx, user)
}

func (c *UserController) DeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	if err := c.userRepo.DeleteUser(userID); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}
	c.baseController.ResponseJSONDeleted(ctx, nil)
}

func (c *UserController) ForceDeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	if err := c.userRepo.ForceDeleteUser(userID); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_FailedToDelete, err.Error())
		return
	}
	c.baseController.ResponseJSONDeleted(ctx, nil)
}

func (c *UserController) SendResetCode(ctx *gin.Context) {
	var req sendResetCodeRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	_, err := c.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Email not registered")
		return
	}

	code := utils.GenerateRandomOTP(6)
	if err := c.otpRepo.SaveOTP(req.Email, code); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to store OTP")
		return
	}

	subject := "Reset Password Code"
	body := fmt.Sprintf(
		`<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
				<h2 style="color: #333;">Reset Password</h2>
				<p style="color: #555;">Halo,</p>
				<p style="color: #555;">Kode verifikasi untuk reset password kamu adalah:</p>
				<h1 style="color: #2e86de; font-size: 36px; letter-spacing: 4px;">%s</h1>
				<p style="color: #555;">Jangan kasih kode ini ke siapa pun. Berlaku cuma beberapa menit aja.</p>
				<br>
				<p style="color: #999;">- Tim Easy Money</p>
			</div>
		</div>`, code)

	log.Println("Mengirim email ke:", req.Email)
	if err := utils.SendEmail(req.Email, subject, body); err != nil {
		log.Println("Gagal kirim email:", err)
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to send email")
		return
	}
	log.Println("Email berhasil dikirim ke:", req.Email)
	c.baseController.ResponseJSONCreated(ctx, gin.H{"message": "Reset code sent"})
}

func (c *UserController) CheckCode(ctx *gin.Context) {
	var req CodeRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	otp, err := c.otpRepo.GetLatestOTPByEmail(req.Email)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "Email not registered")
		return
	}

	if otp.Code != req.Code {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid code")
		return
	}

	c.baseController.ResponseJSONCreated(ctx, gin.H{"message": "Code is valid"})
}

func (c *UserController) ResetPassword(ctx *gin.Context) {
	var req resetPasswordRequest
	if !utils.HandleValidation(ctx, &req, func(ctx *gin.Context, code string, err error) {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.NewPassword != req.NewPasswordConfirm {
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Passwords do not match")
		return
	}

	userID := ctx.Param("id")
	user, err := c.userRepo.GetUserByID(userID)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_NotFound, err.Error())
		return
	}

	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to hash password")
		return
	}
	user.Password = string(hashedPassword)

	if err := c.userRepo.UpdateUser(userID, user); err != nil {
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to update password")
		return
	}
	c.baseController.ResponseJSONUpdated(ctx, gin.H{"message": "Password updated"})
}
