.PHONY: buf sqlc run

buf:
	@buf generate proto

sqlc:
	@sqlc generate

run:
	@go build -o main .
	@./main

clean:
	@rm main
