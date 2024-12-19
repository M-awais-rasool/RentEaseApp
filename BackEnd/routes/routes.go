package routes

import (
	"demo/handlers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetRoutes() *gin.Engine {
	router := gin.Default()

	router.POST("Auth/sign-in", handlers.SignIn)
	router.POST("Auth/sign-up", handlers.SignUp)

	router.POST("item/create-item", handlers.CreateItem)
	router.POST("item/get-items-by-categories", handlers.GetItemsByCategories)
	router.GET("item/get-all-items", handlers.GetAllItems)
	router.GET("item/get-item-byUserID", handlers.Get_Items_ByUserID)

	router.POST("Rent/rental-item", handlers.Rent_item)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}
