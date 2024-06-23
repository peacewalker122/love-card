package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func Int32ToIntP(val int32) int {
	res := int(val)

	return res
}

func GrpcLogger(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (resp interface{}, err error) {
	fmt.Println("test")
	startTime := time.Now()
	result, err := handler(ctx, req)
	duration := time.Since(startTime)

	statusCode := codes.Unknown
	if st, ok := status.FromError(err); ok {
		statusCode = st.Code()
	}

	logger := log.Info()
	if err != nil {
		logger = log.Error().Err(err)
	}

	logger.Str("protocol", "grpc").
		Str("method", info.FullMethod).
		Int("status_code", int(statusCode)).
		Str("status_text", statusCode.String()).
		Dur("duration", duration).
		Msg("received a gRPC request")

	return result, err
}

// LoggingMiddleware is an HTTP middleware that logs details about each request.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		logger := log.Info()

		// Read and log the request body
		var requestBody []byte

		if r.Method == http.MethodPost {
			if r.Body != nil {
				requestBody, _ = io.ReadAll(io.Reader(r.Body))
				r.Body = io.NopCloser(io.Reader(bytes.NewBuffer(requestBody)))
				logger.RawJSON("request", requestBody)
			}
		}

		// Create a ResponseWriter wrapper to capture the status code
		wrappedWriter := &statusResponseWriter{ResponseWriter: w, statusCode: http.StatusOK, Response: new(bytes.Buffer)}
		next.ServeHTTP(wrappedWriter, r)

		defer func() {
			if err := recover(); err != nil {
				duration := time.Since(startTime)
				log.Error().
					Str("protocol", "http").
					Str("method", r.Method).
					Str("url", r.URL.String()).
					Int("status_code", http.StatusInternalServerError).
					Bytes("response", wrappedWriter.Response.Bytes()).
					Dur("duration", duration).
					Msgf("panic recovered: %v", err)

				http.Error(wrappedWriter, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		duration := time.Since(startTime)
		statusCode := wrappedWriter.statusCode

		if statusCode >= 400 {
			logger = log.Error().
				RawJSON("response", wrappedWriter.Response.Bytes())
		}

		logger.
			Str("protocol", "http").
			Str("method", r.Method).
			Str("url", r.URL.String()).
			Int("status_code", statusCode).
			Dur("duration", duration).
			Msg("received an HTTP request")
	})
}

// statusResponseWriter is a wrapper around http.ResponseWriter that captures the status code.
type statusResponseWriter struct {
	http.ResponseWriter
	Response   *bytes.Buffer
	statusCode int
}

func (w *statusResponseWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode
	w.ResponseWriter.WriteHeader(statusCode)
}

func (w *statusResponseWriter) Write(val []byte) (int, error) {
	w.Response.Write(val)

	return w.ResponseWriter.Write(val)
}
