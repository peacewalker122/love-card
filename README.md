# Fun HTTP Server Project

## Prerequisites
This is a fun project designed to explore HTTP server middleware and logging in Go. The goal is to learn and have fun while building a simple HTTP server with `gRPC` gateway and Next.js as the frontend.

## Introduction
Welcome to the Fun HTTP Server Project! This project demonstrates how to create an HTTP server in Go with middleware for logging request details. The server logs information such as request method, URL, status code, duration, client IP, user agent, and more.

## Getting Started

### Prerequisites
- Go 1.15 or later
- A basic understanding of Go programming
- Interest in learning about gRPC

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/peacewalker122/love-card.git
    ```

2. Change into the project directory:
    ```sh
    cd fun-http-server
    ```

3. Install the required dependencies:
    ```sh
    go get -u github.com/rs/zerolog
    ```

### Running the Server

1. Run the HTTP server:
    ```sh
    go run main.go
    ```

2. Open your web browser or use a tool like `curl` to make requests to the server:
    ```sh
    curl http://localhost:8080/
    ```

### Project Structure

- `main.go`: The main application file that sets up the HTTP server and logging middleware.
- `statusResponseWriter.go`: A helper file that wraps the `http.ResponseWriter` to capture the status code.

### TODO List

- [x] Create a basic HTTP server with logging middleware
- [ ] Implement detailed logging using `zerolog`
- [ ] Add more routes and handlers to the server
- [ ] Create a frontend for interacting with the server
    - [ ] Design a simple HTML page to display server responses
    - [ ] Implement JavaScript to make requests to the server
    - [ ] Style the frontend using CSS for better user experience
- [ ] Add more middleware functions (e.g., authentication, rate limiting)
- [ ] Write tests for the server and middleware

## Contributing
This project is for fun and learning, but contributions are welcome! Feel free to fork the repository, make improvements, and submit pull requests.

## License
This project is licensed under the MIT License.

## Acknowledgments
- Thanks to the authors of `zerolog` for providing a powerful logging library.
- Thanks to the Go community for their excellent documentation and resources.

Enjoy building and have fun!
