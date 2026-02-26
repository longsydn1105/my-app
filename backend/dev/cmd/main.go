package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/longdaica/my-app/backend/cmd"
	"github.com/longdaica/my-app/backend/config"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	db := config.ConnectDB()
	mux := cmd.SetupDI(db)

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handlerWithCORS := corsMiddleware.Handler(mux)
	addr := "localhost:8080"
	fmt.Printf("🚀 Động cơ đã kích hoạt tại http://%s\n", addr)

	server := http.Server{
		Addr:    addr,
		Handler: h2c.NewHandler(handlerWithCORS, &http2.Server{}),
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal("Server ngủm:", err)
	}
}
