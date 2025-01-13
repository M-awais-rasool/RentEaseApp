package routes

import (
	"demo/handlers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetRoutes() *gin.Engine {
	router := gin.Default()

	go handlers.BroadcastMessages()
	router.GET("/ws", handlers.WebSocketHandler)

	router.POST("Auth/sign-in", handlers.SignIn)
	router.POST("Auth/sign-up", handlers.SignUp)

	router.POST("item/create-item", handlers.CreateItem)
	router.POST("item/get-items-by-categories", handlers.GetItemsByCategories)
	router.GET("item/get-all-items", handlers.GetAllItems)
	router.GET("item/get-item-byID/:id", handlers.GetItemsByID)
	router.GET("item/get-item-byUserID", handlers.Get_Items_ByUserID)

	router.POST("chat/send-message", handlers.SendMessage)
	router.GET("chat/get-messages", handlers.GetMessages)
	router.GET("chat/users-with-last-message", handlers.GetLastMessages)
	router.DELETE("chat/delete-messages", handlers.DeleteMessages)

	router.POST("Rent/rental-item", handlers.Rent_item)

	router.GET("Profile/get-profile", handlers.Get_profile)
	router.PUT("Profile/update-profile", handlers.UpdateProfile)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}
