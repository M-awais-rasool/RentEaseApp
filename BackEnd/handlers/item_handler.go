package handlers

import (
	"context"
	"database/sql"
	"demo/database"
	"demo/envConfig"
	"demo/models"
	"demo/utils"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary Create Item
// @Description Create an item with a UUID, images, name, description, category, and price
// @Tags Items
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param name formData string true "Item Name"
// @Param description formData string true "Item Description"
// @Param category formData string true "Item Category"
// @Param price formData number true "Item Price"
// @Param image1 formData file true "First Image (required)"
// @Param image2 formData file true "Second Image (required)"
// @Param image3 formData file true "Third Image (required)"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /item/create-item [post]
func CreateItem(c *gin.Context) {
	var req models.CreateItemRequest

	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}
	claim, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	userID := claim.Subject
	log.Printf("Extracted userID from JWT: %s", userID)

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.Status = "available"

	s3Region, accessKeyID, s3Bucket, secretKey := envConfig.GetEnvVars()
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(s3Region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKeyID,
			secretKey,
			"",
		)),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to configure AWS"})
		return
	}

	s3Client := s3.NewFromConfig(cfg)

	uploadToS3 := func(image *multipart.FileHeader) (string, error) {
		file, err := image.Open()
		if err != nil {
			return "", err
		}
		defer file.Close()

		filename := time.Now().Format("20060102150405") + "-" + image.Filename
		_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket: aws.String(s3Bucket),
			Key:    aws.String(filename),
			Body:   file,
		})
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s3Bucket, s3Region, filename), nil
	}

	imageURLs := []string{}
	for _, image := range []*multipart.FileHeader{req.Image1, req.Image2, req.Image3} {
		url, err := uploadToS3(image)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Failed to upload to S3: %s", err.Error()),
			})
			return
		}
		imageURLs = append(imageURLs, url)
	}

	req.ID = uuid.New().String()

	query := `
        INSERT INTO Items (ID, UserID, Name, Description, Category, price, Image1, Image2, Image3, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = database.DB.Exec(query,
		req.ID,
		userID,
		req.Name,
		req.Description,
		req.Category,
		req.Price,
		imageURLs[0],
		imageURLs[1],
		imageURLs[2],
		req.Status,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to save item to database: %s", err.Error()),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Item created successfully",
		"status":  req.Status,
	})
}

// @Summary Get Items by User ID
// @Description Retrieves items associated with a specific user based on the provided JWT token.
// @Tags Items
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.Response "Item data"
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /item/get-item-byUserID [get]
func Get_Items_ByUserID(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "missing token"})
		return
	}

	claim, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": err.Error()})
		return
	}

	userId := claim.Subject
	log.Println("Generated User ID:", userId)

	query := `SELECT ID, Name, Description, Category, Image1, Image2, Image3, Status, price
	          FROM Items WHERE UserID = ?`

	rows, err := database.DB.Query(query, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to retrieve items", "error": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.Response

	for rows.Next() {
		var item models.Response
		err := rows.Scan(
			&item.ID,
			&item.Name,
			&item.Description,
			&item.Category,
			&item.Image1,
			&item.Image2,
			&item.Image3,
			&item.Status,
			&item.Price,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "error scanning row", "error": err.Error()})
			return
		}

		items = append(items, item)
	}

	if len(items) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "no items found for user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   items,
	})
}

// @Summary Get All Items
// @Description Retrieve all items from the database
// @Tags Items
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /item/get-all-items [get]
func GetAllItems(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Missing token"})
		return
	}
	_, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	query := `
        SELECT ID, UserID, Name, Description, Category, Image1, Image2, Image3, status, price 
        FROM Items`

	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": fmt.Sprintf("Failed to retrieve items: %s", err.Error()),
		})
		return
	}
	defer rows.Close()

	items := []map[string]interface{}{}
	for rows.Next() {
		var id, userID, name, description, category, image1, image2, image3, status string
		var price int
		if err := rows.Scan(&id, &userID, &name, &description, &category, &image1, &image2, &image3, &status, &price); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Failed to scan item: %s", err.Error()),
			})
			return
		}

		item := map[string]interface{}{
			"id":          id,
			"name":        name,
			"description": description,
			"category":    category,
			"status":      status,
			"price":       price,
			"image1":      image1,
			"image2":      image2,
			"image3":      image3,
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   items,
	})
}

// @Summary Get Items by Categories
// @Description Retrieve items filtered by specified categories
// @Tags Items
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.GetItemsByCategoriesRequest true "Categories Filter"
// @Success 200 {object} models.SuccessResponse "Successfully retrieved items"
// @Failure 400 {object} models.ErrorResponse "Invalid input"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /item/get-items-by-categories [post]
func GetItemsByCategories(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, map[string]interface{}{"status": "error", "message": "Missing token"})
		return
	}
	_, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, map[string]interface{}{"status": "error", "message": "Invalid token"})
		return
	}

	var input models.GetItemsByCategoriesRequest

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, map[string]interface{}{
			"status":  "error",
			"message": "Invalid categories input: " + err.Error(),
		})
		return
	}

	if len(input.Categories) == 0 {
		c.JSON(http.StatusBadRequest, map[string]interface{}{
			"status":  "error",
			"message": "Categories cannot be empty",
		})
		return
	}

	categories := input.Categories

	query := `
        SELECT ID,  Name, Description, Category, Image1, Image2, Image3, status, price
        FROM Items 
        WHERE Category IN (?` + strings.Repeat(",?", len(categories)-1) + `)`

	args := make([]interface{}, len(categories))
	for i, category := range categories {
		args[i] = category
	}

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"status":  "error",
			"message": fmt.Sprintf("Failed to retrieve items: %s", err.Error()),
		})
		return
	}
	defer rows.Close()

	items := []map[string]interface{}{}
	for rows.Next() {
		var id, name, description, category, image1, image2, image3, status string
		var price int
		if err := rows.Scan(&id, &name, &description, &category, &image1, &image2, &image3, &status, &price); err != nil {
			c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"status":  "error",
				"message": fmt.Sprintf("Failed to scan item: %s", err.Error()),
			})
			return
		}

		item := map[string]interface{}{
			"id":          id,
			"name":        name,
			"description": description,
			"category":    category,
			"status":      status,
			"price":       price,
			"image1":      image1,
			"image2":      image2,
			"image3":      image3,
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"data":   items,
	})
}

// @Summary Get Items by ID
// @Description Retrieve an item by its ID
// @Tags Items
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Item ID"
// @Success 200 {object} models.Response "Item data"
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /item/get-item-byID/{id} [get]
func GetItemsByID(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Missing token"})
		return
	}
	_, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}
	id := c.Param("id")
	items := []map[string]interface{}{}

	query := `
        SELECT ID, Name, Description, Category, Image1, Image2, Image3, status, price
        FROM Items 
        WHERE ID = ?`
	var ID, Name, Description, Category, Image1, Image2, Image3, Status string
	var Price int
	err = database.DB.QueryRow(query, id).Scan(&ID, &Name, &Description, &Category, &Image1, &Image2, &Image3, &Status, &Price)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Item not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Query error"})
		}
		return
	}
	item := map[string]interface{}{
		"id":          ID,
		"name":        Name,
		"description": Description,
		"category":    Category,
		"status":      Status,
		"price":       Price,
		"images": []string{
			Image1,
			Image2,
			Image3,
		},
	}
	items = append(items, item)
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": items})
}
