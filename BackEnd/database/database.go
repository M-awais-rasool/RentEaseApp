package database

import (
	"database/sql"
	"log"

	_ "github.com/denisenkom/go-mssqldb"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	connString := "server=localhost;user id=SA;password=MyStrongPass123;port=1433;database=Behance;encrypt=disable"

	DB, err = sql.Open("mssql", connString)
	if err != nil {
		log.Fatal("Error opening connection to database: ", err.Error())
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error pinging database: ", err.Error())
	}

	log.Println("Connected to the database successfully!")
}
