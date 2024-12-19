package models

import "mime/multipart"

// CreateItemRequest represents the request payload for creating an item.
// @Description Request payload for creating an item.
type CreateItemRequest struct {
	ID          string                `json:"id"`
	Name        string                `form:"name" binding:"required" example:"Sample Item"`
	Description string                `form:"description" binding:"required" example:"A cool item"`
	Category    string                `form:"category" binding:"required" example:"Electronics"`
	Price       int                   `form:"price" binding:"required" example:"99"`
	Image1      *multipart.FileHeader `form:"image1" binding:"required"`
	Image2      *multipart.FileHeader `form:"image2" binding:"required"`
	Image3      *multipart.FileHeader `form:"image3" binding:"required"`
	Status      string                `json:"status"`
}

// Response represents the structure of an item returned by the API.
// @Description Response payload for item details.
type Response struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image1      string `json:"image1"`
	Image2      string `json:"image2"`
	Image3      string `json:"image3"`
	Status      string `json:"status"`
	Price       int    `json:"price"`
}

// GetItemsByCategoriesRequest represents the input for filtering items by categories
type GetItemsByCategoriesRequest struct {
	Categories []string `json:"categories" example:"electronics,clothing"`
}

// SuccessResponse represents a successful response
type SuccessResponse struct {
	Status string                   `json:"status" example:"success"`
	Data   []map[string]interface{} `json:"data"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Status  string `json:"status" example:"error"`
	Message string `json:"message" example:"Invalid input"`
}
