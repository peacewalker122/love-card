-- name: CreateCard :one
INSERT INTO card (letter, created_at, author)
VALUES ($1,$2,$3)
RETURNING *;

-- name: GetCard :many
SELECT
    card.letter,
    card.author,
    card.created_at
FROM
    card
WHERE
    card.searchable @@ to_tsquery('english',$1)
    or
    to_tsvector('english', author) @@ to_tsquery('english',$1);
