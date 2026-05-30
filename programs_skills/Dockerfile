# Build stage
FROM golang:1.24.5-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server_binary server.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/server_binary .

# Copy the data directories
COPY --from=builder /app/getCompetitorsSkills ./getCompetitorsSkills

# Expose port
EXPOSE 8009

# Run the binary
CMD ["./server_binary"] 