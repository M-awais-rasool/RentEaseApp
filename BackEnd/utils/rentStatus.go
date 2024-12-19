package utils

import (
	"demo/database"
	"log"
	"time"
)

func StartStatusUpdateService() func() {
	ticker := time.NewTicker(24 * time.Hour)
	stop := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				log.Println("Running scheduled status update...")
				UpdateRentalStatuses()
			case <-stop:
				ticker.Stop()
				log.Println("Stopped status update service.")
				return
			}
		}
	}()

	return func() {
		close(stop)
	}
}

func UpdateRentalStatuses() {
	currentDate := time.Now().Truncate(24 * time.Hour).Format("2006-01-02")

	query := `
		SELECT id, item_id 
		FROM rental 
		WHERE end_date < ? AND rental_status = 'active'`
	rows, err := database.DB.Query(query, currentDate)
	if err != nil {
		log.Printf("Error querying expired rentals: %v\n", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var rentalID, itemID string
		if err := rows.Scan(&rentalID, &itemID); err != nil {
			log.Printf("Error scanning rental row: %v\n", err)
			continue
		}

		tx, err := database.DB.Begin()
		if err != nil {
			log.Printf("Error starting transaction: %v\n", err)
			continue
		}

		updateRentalQuery := `UPDATE rental SET rental_status = 'completed' WHERE id = ?`
		_, err = tx.Exec(updateRentalQuery, rentalID)
		if err != nil {
			tx.Rollback()
			log.Printf("Error updating rental status: %v\n", err)
			continue
		}

		updateItemQuery := `UPDATE items SET status = 'available' WHERE id = ?`
		_, err = tx.Exec(updateItemQuery, itemID)
		if err != nil {
			tx.Rollback()
			log.Printf("Error updating item status: %v\n", err)
			continue
		}

		err = tx.Commit()
		if err != nil {
			log.Printf("Error committing transaction: %v\n", err)
		} else {
			log.Printf("Rental %s marked as completed, item %s is now available\n", rentalID, itemID)
		}
	}
}
