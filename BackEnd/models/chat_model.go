package models

// Message represents the message data structure.
// @Description Message model for sending messages
type Message struct {
	// ReceiverID is the unique identifier of the message recipient.
	// Required: true
	ReceiverID string `json:"receiver_id" binding:"required"`
	// Content is the text content of the message.
	// Required: true
	Content string `json:"content" binding:"required"`
}

type RequestBody struct {
	Messages []string `json:"messages"`
}
