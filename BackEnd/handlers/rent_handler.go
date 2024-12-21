package handlers

import (
	"database/sql"
	"demo/database"
	"demo/models"
	"demo/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary Rent a Items
// @Description Collect rental start and end dates from the user and mark the car status as "not available"
// @Tags Rental Item
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param RentalRequest body models.RentReq true "Rental Request"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /Rent/rental-item [post]
func Rent_item(c *gin.Context) {
	var req models.RentReq

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

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format. Use YYYY-MM-DD."})
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format. Use YYYY-MM-DD."})
		return
	}

	currentDate := time.Now().Truncate(24 * time.Hour)
	if startDate.Before(currentDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date cannot be in the past."})
		return
	}

	if endDate.Before(startDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "End date must be after start date."})
		return
	}

	var currentStatus string
	query := "SELECT status FROM items WHERE id = ?"
	err = database.DB.QueryRow(query, req.ItemID).Scan(&currentStatus)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Car not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		}
		return
	}

	if currentStatus == "not available" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Car is already rented"})
		return
	}

	rentalID := uuid.New().String()

	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}

	insertRentalQuery := `
		INSERT INTO rental (id, user_id, item_id, start_date, end_date, rental_status) 
		VALUES (?, ?, ?, ?, ?, ?)`
	_, err = tx.Exec(insertRentalQuery, rentalID, userId, req.ItemID, startDate.Format("2006-01-02"), endDate.Format("2006-01-02"), "active")
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert rental record"})
		return
	}

	updateItemQuery := "UPDATE items SET status = 'not available' WHERE id = ?"
	_, err = tx.Exec(updateItemQuery, req.ItemID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
		return
	}

	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item rented successfully",
		"itemID":  req.ItemID,
	})
}
