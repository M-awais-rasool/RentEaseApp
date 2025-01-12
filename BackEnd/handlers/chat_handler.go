package handlers

import (
	"demo/database"
	"demo/models"
	"demo/utils"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary Send a message to another user
// @Description Sends a message from the authenticated user to another user. Validates both SenderID (from token) and ReceiverID (from request body) exist in the Users table.
// @Tags Chat
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param message body models.Message true "Message data"
// @Success 201 {object} map[string]string "Message sent successfully"
// @Failure 400 {object} map[string]string "Invalid SenderID or ReceiverID"
// @Failure 401 {object} map[string]string "Missing or invalid token"
// @Failure 500 {object} map[string]string "Error saving message"
// @Router /chat/send-message [post]
func SendMessage(c *gin.Context) {
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

	var message models.Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	senderId := claim.Subject
	id := uuid.New().String()

	var senderExists int
	err = database.DB.QueryRow("SELECT COUNT(1) FROM Users WHERE ID = ?", senderId).Scan(&senderExists)
	if err != nil || senderExists == 0 {
		log.Printf("[ERROR] SenderID %s does not exist or query failed: %v\n", senderId, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid SenderID"})
		return
	}

	var receiverExists int
	err = database.DB.QueryRow("SELECT COUNT(1) FROM Users WHERE ID = ?", message.ReceiverID).Scan(&receiverExists)
	if err != nil || receiverExists == 0 {
		log.Printf("[ERROR] ReceiverID %s does not exist or query failed: %v\n", message.ReceiverID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ReceiverID"})
		return
	}

	query := `INSERT INTO Messages (ID, SenderID, ReceiverID, Content, Timestamp) VALUES (?, ?, ?, ?, ?)`
	_, err = database.DB.Exec(query, id, senderId, message.ReceiverID, message.Content, time.Now())
	if err != nil {
		log.Printf("[ERROR] Failed to save message to database: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving message"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Message sent successfully"})
}

// @Summary Get messages for the authenticated user with a specific receiver
// @Description Retrieves all messages sent by the authenticated user to a specific receiver, ordered by timestamp in descending order.
// @Tags Chat
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param receiverId query string true "Receiver User ID"
// @Success 200 {object} []map[string]interface{} "List of messages"
// @Failure 401 {object} map[string]string "Missing or invalid token"
// @Failure 400 {object} map[string]string "Receiver ID is required"
// @Failure 500 {object} map[string]string "Error retrieving messages"
// @Router /chat/get-messages [get]
func GetMessages(c *gin.Context) {
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

	senderId := claim.Subject

	receiverId := c.DefaultQuery("receiverId", "")
	if receiverId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Receiver ID is required"})
		return
	}

	var receiverName string
	var receiverImage *string
	err = database.DB.QueryRow("SELECT name, image FROM Users WHERE id = ?", receiverId).Scan(&receiverName, &receiverImage)
	if err != nil {
		log.Println("Error querying receiver:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving receiver's details"})
		return
	}
	if receiverImage == nil {
		receiverImage = new(string)
		*receiverImage = ""
	}
	query := `
        SELECT 
            m.ID, 
            m.SenderID, 
            m.ReceiverID, 
            m.Content, 
            m.Timestamp
        FROM Messages m
        WHERE 
            (m.SenderID = ? AND m.ReceiverID = ?) OR 
            (m.SenderID = ? AND m.ReceiverID = ?)
        ORDER BY m.Timestamp ASC
    `
	rows, err := database.DB.Query(query, senderId, receiverId, receiverId, senderId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving messages"})
		return
	}
	defer rows.Close()

	var messages []map[string]interface{}

	for rows.Next() {
		var timestamp time.Time
		var ID, SenderID, ReceiverID, Content string
		if err := rows.Scan(&ID, &SenderID, &ReceiverID, &Content, &timestamp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning message"})
			return
		}
		message := map[string]interface{}{
			"id":         ID,
			"senderId":   SenderID,
			"receiverId": ReceiverID,
			"content":    Content,
			"timestamp":  timestamp,
		}
		messages = append(messages, message)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        "success",
		"receiverName":  receiverName,
		"receiverImage": *receiverImage,
		"messages":      messages,
	})
}

// @Summary Delete messages
// @Description Deletes messages by their IDs for the authenticated user.
// @Tags Chat
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param messages body models.RequestBody true "List of message IDs to delete"
// @Success 200 {object} map[string]interface{} "Messages deleted successfully"
// @Failure 400 {object} map[string]string "Invalid request"
// @Failure 401 {object} map[string]string "Missing or invalid token"
// @Failure 500 {object} map[string]string "Error deleting messages"
// @Router /chat/delete-messages [delete]
func DeleteMessages(c *gin.Context) {
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

	var requestBody models.RequestBody

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid request format"})
		return
	}

	messageIds := requestBody.Messages
	if len(messageIds) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "No message IDs provided"})
		return
	}

	inClause := "?"
	for i := 1; i < len(messageIds); i++ {
		inClause += ",?"
	}

	query := fmt.Sprintf(`DELETE FROM Messages WHERE ID IN (%s) AND (SenderID = ? OR ReceiverID = ?)`, inClause)

	args := make([]interface{}, 0, len(messageIds)+2)
	for _, msgID := range messageIds {
		args = append(args, msgID)
	}
	args = append(args, claim.Subject, claim.Subject)

	result, err := database.DB.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error deleting messages"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching affected rows"})
		return
	}

	if rowsAffected > 0 {
		c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Messages deleted successfully", "deleted": rowsAffected})
	} else {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No messages found to delete"})
	}
}

// @Summary Get users with the last message in both directions
// @Description Retrieves users and their last message exchanged with the authenticated user.
// @Tags Chat
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} []map[string]interface{} "List of users with their last message"
// @Failure 500 {object} map[string]string "Error retrieving users and messages"
// @Router /chat/users-with-last-message [get]
func GetLastMessages(c *gin.Context) {
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
	userID := claim.Subject

	query := `
    WITH LatestMessages AS (
        SELECT 
            CASE 
                WHEN SenderID = ? THEN ReceiverID 
                ELSE SenderID 
            END AS ContactID,
            ID, Content, Timestamp, SenderID, ReceiverID, IsRead,
            ROW_NUMBER() OVER (PARTITION BY 
                CASE 
                    WHEN SenderID = ? THEN ReceiverID 
                    ELSE SenderID 
                END 
            ORDER BY Timestamp DESC) as rn
        FROM Messages 
        WHERE SenderID = ? OR ReceiverID = ?
    )
    SELECT 
        u.id,
        u.name,
        u.image,
        m.ID AS MessageID,
        m.Content,
        m.Timestamp,
        m.SenderID,
        m.ReceiverID,
        m.IsRead,
        (SELECT COUNT(*) 
         FROM Messages 
         WHERE SenderID = u.id 
         AND ReceiverID = ? 
         AND IsRead = 0) as UnreadCount
    FROM LatestMessages m
    JOIN Users u ON u.id = m.ContactID
    WHERE m.rn = 1
    ORDER BY m.Timestamp DESC`

	rows, err := database.DB.Query(query, userID, userID, userID, userID, userID)
	if err != nil {
		log.Printf("Query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve chats"})
		return
	}
	defer rows.Close()

	var chats []gin.H
	for rows.Next() {
		var userImage *string
		var (
			userID, userName, msgID, content, senderID, receiverID string
			timestamp                                              time.Time
			isRead                                                 bool
			unreadCount                                            int
		)

		err := rows.Scan(&userID, &userName, &userImage, &msgID, &content, &timestamp,
			&senderID, &receiverID, &isRead, &unreadCount)
		if err != nil {
			log.Println("Error querying receiver:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}

		chats = append(chats, gin.H{
			"user_id":      userID,
			"name":         userName,
			"image":        userImage,
			"unread_count": unreadCount,
			"last_message": gin.H{
				"id":            msgID,
				"content":       content,
				"timestamp":     formatMessageTime(timestamp),
				"is_sent_by_me": senderID == userID,
				"is_read":       isRead,
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   chats,
	})
}

func formatMessageTime(t time.Time) string {
	now := time.Now()
	if t.Format("2006-01-02") == now.Format("2006-01-02") {
		return t.Format("15:04")
	}
	if t.Year() == now.Year() {
		return t.Format("02 Jan")
	}
	return t.Format("02/01/2006")
}
