package controller

import (
	"backend-capstone/models"
	"backend-capstone/repository"
	"backend-capstone/utils"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"

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
	Email              string `json:"email" binding:"required,email"` // <-- Tambah Email
	Code               string `json:"code" binding:"required"`        // <-- Tambah Kode
	NewPassword        string `json:"new_password" binding:"required"`
	NewPasswordConfirm string `json:"new_password_confirm" binding:"required"`
}

type updateProfileRequest struct {
	Username    string `form:"username"`     
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
			"profile_image_path": user.ProfileImagePath,
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
		log.Printf("[ResetPassword] Validation/Binding Error: %v", err)
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, err.Error())
	}) {
		return
	}

	if req.NewPassword != req.NewPasswordConfirm {
		log.Printf("[ResetPassword] Passwords do not match for email: %s", req.Email)
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Passwords do not match")
		return
	}

	otp, err := c.otpRepo.GetLatestOTPByEmail(req.Email)
	if err != nil {
		log.Printf("[ResetPassword] Error getting OTP for %s: %v", req.Email, err)
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid email or unable to verify code")
		return
	}
	if otp.Code != req.Code {
		log.Printf("[ResetPassword] Invalid code for %s. Received: %s, Expected: %s", req.Email, req.Code, otp.Code)
		c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid verification code")
		return
	}

	user, err := c.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		log.Printf("[ResetPassword] Error getting user by email %s after code validation: %v", req.Email, err)
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "User not found for the provided email")
		return
	}
    if err := c.otpRepo.DeleteOTPByEmail(req.Email); err != nil {
		log.Printf("[ResetPassword] Warning: Failed to delete OTP for email %s: %v", req.Email, err)
    }

    hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		log.Printf("[ResetPassword] Error hashing password for user %d: %v", user.ID, err)
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to hash password")
		return
	}
	user.Password = string(hashedPassword)

	if err := c.userRepo.UpdateUser(fmt.Sprint(user.ID), user); err != nil {
		log.Printf("[ResetPassword] Error updating password for user %d: %v", user.ID, err)
		c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to update password")
		return
	}

    log.Printf("[ResetPassword] Password successfully updated for user %d (email: %s)", user.ID, user.Email)
	c.baseController.ResponseJSONUpdated(ctx, gin.H{"message": "Password updated successfully"})
}

func (c *UserController) UpdateProfile(ctx *gin.Context) {
	userIDAny, exists := ctx.Get("user_id")
	if !exists {
		log.Println("[UpdateProfile] Error: user_id not found in context")
		c.baseController.ResponseJSONError(ctx, Error_Unauthorized, "User ID not found in token")
		return
	}
    var userID uint
    switch v := userIDAny.(type) {
    case float64:
        userID = uint(v)
    case uint:
        userID = v
    case int:
        userID = uint(v)
    default:
         log.Printf("[UpdateProfile] Error: Invalid type for user_id in context: %T", userIDAny)
         c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Invalid user ID type in token")
         return
    }
    log.Printf("[UpdateProfile] Updating profile for User ID: %d", userID)

	user, err := c.userRepo.GetUserByID(fmt.Sprint(userID)) 
	if err != nil {
        log.Printf("[UpdateProfile] Error getting user %d: %v", userID, err)
		c.baseController.ResponseJSONError(ctx, Error_NotFound, "User profile not found")
		return
	}

    var req updateProfileRequest
    if err := ctx.ShouldBind(&req); err != nil {
         log.Printf("[UpdateProfile] Error binding form data for user %d: %v", userID, err)
         c.baseController.ResponseJSONError(ctx, Error_BadRequest, fmt.Sprintf("Invalid form data: %v", err))
         return
    }
     log.Printf("[UpdateProfile] Received form data: Username='%s'", req.Username)


	if req.Username != "" && req.Username != user.Username {
        log.Printf("[UpdateProfile] Updating username for user %d to '%s'", userID, req.Username)
		user.Username = req.Username
	}

    file, header, err := ctx.Request.FormFile("profile_image") 
    if err == nil {
        defer file.Close()
        log.Printf("[UpdateProfile] Received profile image: %s, Size: %d", header.Filename, header.Size)

        ext := filepath.Ext(header.Filename)
        if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
             log.Printf("[UpdateProfile] Invalid file type for user %d: %s", userID, ext)
             c.baseController.ResponseJSONError(ctx, Error_BadRequest, "Invalid file type. Only JPG, JPEG, PNG allowed.")
             return
        }

        filename := fmt.Sprintf("user_%d_profile_%d%s", userID, time.Now().Unix(), ext)
        filePath := filepath.Join("uploads", "profiles", filename) // Path relatif di server

        if err := ctx.SaveUploadedFile(header, filePath); err != nil {
             log.Printf("[UpdateProfile] Error saving uploaded file for user %d: %v", userID, err)
             c.baseController.ResponseJSONError(ctx, Error_InternalServer, "Failed to save profile image")
             return
        }
        log.Printf("[UpdateProfile] Profile image saved to: %s", filePath)

        user.ProfileImagePath = filePath 

    } else if err != http.ErrMissingFile {
         log.Printf("[UpdateProfile] Error retrieving profile image for user %d: %v", userID, err)
         c.baseController.ResponseJSONError(ctx, Error_BadRequest, fmt.Sprintf("Error processing profile image: %v", err))
         return
    } else {
        log.Printf("[UpdateProfile] No profile image uploaded for user %d.", userID)
    }

	if err := c.userRepo.UpdateUser(fmt.Sprint(userID), user); err != nil {
         log.Printf("[UpdateProfile] Error updating user profile %d in DB: %v", userID, err)
		c.baseController.ResponseJSONError(ctx, Error_FailedToUpdate, "Failed to update profile")
		return
	}

    updatedUserResponse := gin.H{
        "id": user.ID,
        "username": user.Username,
        "email": user.Email,
        "profile_image_path": user.ProfileImagePath, 
    }
    log.Printf("[UpdateProfile] Profile updated successfully for user %d", userID)
	c.baseController.ResponseJSONUpdated(ctx, gin.H{
        "message": "Profile updated successfully",
        "user": updatedUserResponse,
    })
}
