-- name: CreateCard :one
INSERT INTO card (letter, created_at, author)
VALUES ($1,$2,$3)
RETURNING *;

-- name: GetCard :many
SELECT * FROM card;
