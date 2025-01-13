package handlers

import (
	"database/sql"
	"demo/database"
	"demo/models"
	"demo/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("agfgdfdsgfdfgdertwcvb")

// SignUp godoc
// @Summary Register a new user
// @Description Create a new user account
// @Tags Auth
// @Accept json
// @Produce json
// @Param user body models.SignUp true "User Registration Details"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /Auth/sign-up [post]
func SignUp(c *gin.Context) {
	var user models.SignUp

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	var existingUser models.User
	err := database.DB.QueryRow("SELECT id FROM Users WHERE email = ?", user.Email).Scan(&existingUser.ID)
	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Database query failed"})
		return
	}
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error hashing password"})
		return
	}

	userID := uuid.New().String()

	_, err = database.DB.Exec("INSERT INTO Users (id, name, email, password) VALUES (?, ?, ?, ?)",
		userID, user.Name, user.Email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error creating user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "User registered successfully!",
	})
}

// SignIn godoc
// @Summary User login
// @Description Authenticate user and generate JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param user body models.UserSignIn true "User Login Credentials"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /Auth/sign-in [post]
func SignIn(c *gin.Context) {
	var user models.UserSignIn
	var storedUser models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid input data"})
		return
	}
	err := database.DB.QueryRow("SELECT id, name, email, password FROM Users WHERE email = ?", user.Email).Scan(
		&storedUser.ID,
		&storedUser.Name,
		&storedUser.Email,
		&storedUser.Password,
	)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Email does not exist"})
		return
	} else if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Database error"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid password"})
		return
	}

	claims := &jwt.RegisteredClaims{
		Subject: storedUser.ID.String(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Sign in successful",
		"data": gin.H{
			"name":   storedUser.Name,
			"email":  storedUser.Email,
			"token":  tokenString,
			"userId": storedUser.ID.String(),
		},
	})
}

// @Summary Get Profile
// @Description Get user data
// @Tags Profile
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /Profile/get-profile [get]
func Get_profile(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Missing token"})
		return
	}
	claim, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}
	userId := claim.Subject

	query := `SELECT id, name, email, image FROM Users WHERE id = ?`
	var id, name, email, image string
	err = database.DB.QueryRow(query, userId).Scan(&id, &name, &email, &image)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching user profile"})
		}
		return
	}

	var userItemsCount, userRentalItemsCount int
	err = database.DB.QueryRow(`SELECT COUNT(*) FROM items WHERE UserID = ?`, userId).Scan(&userItemsCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching user items count"})
		return
	}

	err = database.DB.QueryRow(`SELECT COUNT(*) FROM rental WHERE user_id = ?`, userId).Scan(&userRentalItemsCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching user rental items count"})
		return
	}

	data := map[string]interface{}{
		"id":                   id,
		"name":                 name,
		"email":                email,
		"image":                image,
		"userItemsCount":       userItemsCount,
		"userRentalItemsCount": userRentalItemsCount,
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": data})
}

// @Summary Update user profile
// @Description Update the profile of the authenticated user
// @Tags Profile
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param profile body models.UpdateProfileRequest true "Profile data"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /Profile/update-profile [put]
func UpdateProfile(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Missing token"})
		return
	}
	claim, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}
	userId := claim.Subject

	var req models.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid request"})
		return
	}

	query := `UPDATE Users SET name = ?, email = ?, image = ? WHERE id = ?`
	_, err = database.DB.Exec(query, req.Name, req.Email, req.Image, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error updating user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Profile updated successfully"})
}
