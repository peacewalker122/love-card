package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"project/gen/go/card/v1"
)

var urlExample = PriorityString(
	os.Getenv("DB_URL"),
	"postgres://postgres:postgres@localhost:5432/app",
)

func main() {
	database, err := pgxpool.New(context.Background(), urlExample)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer database.Close()

	// Set up a context that is cancelled on interrupt signals
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Run servers in separate goroutines
	go runGatewayServer(ctx, database)
	go runGRPCServer(ctx, database)

	// Wait for context cancellation
	<-ctx.Done()

	// Graceful shutdown logic here
	fmt.Println("Shutting down gracefully...")
}

func runGRPCServer(ctx context.Context, db *pgxpool.Pool) {
	server := NewServer(db)

	grpclogger := grpc.UnaryInterceptor(GrpcLogger)
	grpcserver := grpc.NewServer(grpclogger)
	card.RegisterYourServiceServer(grpcserver, server)
	reflection.Register(grpcserver)

	listener, err := net.Listen("tcp", "127.0.0.1:5001")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	log.Println("gRPC server started")
	go func() {
		if err := grpcserver.Serve(listener); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	<-ctx.Done()

	// Graceful stop
	log.Println("Shutting down gRPC server...")
	grpcserver.GracefulStop()
	log.Println("gRPC server stopped")
}

func runGatewayServer(ctx context.Context, db *pgxpool.Pool) {
	server := NewServer(db)

	grpcmux := runtime.NewServeMux()

	err := card.RegisterYourServiceHandlerServer(ctx, grpcmux, server)
	if err != nil {
		log.Fatalf("failed to register gateway server: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/", LoggingMiddleware(grpcmux))

	fs := http.FileServer(http.Dir("./gen/openapiv2/"))
	mux.Handle("/swagger/", http.StripPrefix("/swagger/", fs))

	mux.Handle("/metrics", promhttp.Handler())

	mux.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello World")
	})

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Allow all origins
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	listener, err := net.Listen("tcp", "127.0.0.1:8081")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	log.Println("HTTP server started")

	srv := &http.Server{
		Handler: c.Handler(mux),
	}

	go func() {
		if err := srv.Serve(listener); err != nil && err != http.ErrServerClosed {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	<-ctx.Done()

	// Graceful stop
	log.Println("Shutting down HTTP server...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("HTTP server shutdown failed:%+v", err)
	}
	log.Println("HTTP server stopped")
}
