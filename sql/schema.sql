create table public.card
(
    letter     varchar(1000)            not null,
    created_at timestamp with time zone not null,
    author     varchar(20)              not null,
    searchable text generated always as (((letter)::text || (author)::text)) stored
);

