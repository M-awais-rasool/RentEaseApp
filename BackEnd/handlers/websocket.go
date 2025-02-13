package handlers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	clients   = make(map[string]*websocket.Conn)
	broadcast = make(chan Message)
	mutex     = sync.Mutex{}
)

type Message struct {
	SenderID   string `json:"senderId"`
	ReceiverID string `json:"receiverId"`
	Content    string `json:"content"`
	Timestamp  string `json:"timestamp"`
}

func WebSocketHandler(c *gin.Context) {
	userID := c.Query("userId")
	if userID == "" {
		log.Println("Missing userId")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing userId"})
		return
	}

	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	defer ws.Close()

	mutex.Lock()
	clients[userID] = ws
	mutex.Unlock()

	defer func() {
		mutex.Lock()
		delete(clients, userID)
		mutex.Unlock()
	}()

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading JSON: %v", err)
			break
		}
		broadcast <- msg
	}
}

func BroadcastMessages() {
	for {
		msg := <-broadcast

		mutex.Lock()
		if recipientConn, ok := clients[msg.ReceiverID]; ok {
			err := recipientConn.WriteJSON(msg)
			if err != nil {
				log.Printf("Error sending message to recipient: %v", err)
				recipientConn.Close()
				delete(clients, msg.ReceiverID)
			}
		} else {
			log.Printf("Recipient %s is not connected", msg.ReceiverID)
		}
		mutex.Unlock()
	}
}
