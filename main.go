package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"project/gen/go/card/v1"
	db "project/src/database/gen"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/jackc/pgx/v5"
	"github.com/rs/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	urlExample := "postgres://postgres:postgres@localhost:5432/app"
	database, err := pgx.Connect(context.Background(), urlExample)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer database.Close(context.Background())

	go runGatewayServer(database)
	runGRPCServer(database)
}

func runGRPCServer(db db.DBTX) {
	server := NewServer(db)

	grpclogger := grpc.UnaryInterceptor(GrpcLogger)
	grpcserver := grpc.NewServer(grpclogger)
	card.RegisterYourServiceServer(grpcserver, server)
	reflection.Register(grpcserver)

	listener, err := net.Listen("tcp", "127.0.0.1:5001")
	if err != nil {
		log.Default().Fatalf("failed to listen: %v", err)
	}

	log.Default().Println("gRPC server started")
	err = grpcserver.Serve(listener)
	if err != nil {
		log.Default().Fatalf("failed to serve: %v", err)
	}
}

func runGatewayServer(db db.DBTX) {
	server := NewServer(db)

	grpcmux := runtime.NewServeMux()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := card.RegisterYourServiceHandlerServer(ctx, grpcmux, server)
	if err != nil {
		log.Default().Fatalf("failed to register gateway server: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/", LoggingMiddleware(grpcmux))

	fs := http.FileServer(http.Dir("./gen/openapiv2/"))
	mux.Handle("/swagger/", LoggingMiddleware(http.StripPrefix("/swagger/", fs)))

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	listener, err := net.Listen("tcp", "127.0.0.1:8081")
	if err != nil {
		log.Default().Fatalf("failed to listen: %v", err)
	}
	log.Default().Println("http server started")

	err = http.Serve(listener, c.Handler(mux))
	if err != nil {
		log.Default().Fatalf("failed to serve: %v", err)
	}
}
