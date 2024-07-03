-- name: CreateCard :one
INSERT INTO card (letter, created_at, author)
VALUES ($1,$2,$3)
RETURNING letter, created_at, author;

-- name: GetCard :many
WITH search_results AS (
    SELECT
        card.letter,
        card.author,
        card.created_at,
        to_tsvector('english', card.letter) || to_tsvector('english', card.author) AS document
    FROM
        card
),
query AS (
    SELECT
        $1::text AS search_term
),
recommendations AS (
    SELECT
        letter,
        author,
        created_at
    FROM
        card
    ORDER BY
        created_at DESC
    LIMIT 10
)
SELECT
    sr.letter,
    sr.author,
    sr.created_at
FROM
    search_results sr, query q
WHERE
    q.search_term IS NOT NULL AND q.search_term != ''
    AND (sr.document @@ to_tsquery('english', q.search_term))

UNION ALL

SELECT
    rec.letter,
    rec.author,
    rec.created_at
FROM
    recommendations rec, query q
WHERE
    q.search_term IS NULL OR q.search_term = '';
