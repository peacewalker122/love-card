# Build Stage
FROM golang:1.22 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN go build -o main .
RUN chmod +x ./main

# Production Stage
FROM debian:bookworm

# Copy the binary from the build stage
COPY --from=builder /app/main /main

# Run the binary
CMD ["./main"]
