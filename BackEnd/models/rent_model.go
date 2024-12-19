package models

// RentRequest defines the structure for rental request
// @Description Represents the request payload for renting a item
type RentReq struct {
	ItemID    string `json:"itemID" binding:"required" example:"CAR123"`
	StartDate string `json:"startDate" binding:"required" example:"2024-01-15"`
	EndDate   string `json:"endDate" binding:"required" example:"2024-01-20"`
}
