CREATE TABLE IF NOT EXISTS card(
    letter varchar(1000) not null ,
    created_at timestamptz not null ,
    author varchar(20) not null,
    searchable tsquery
);
