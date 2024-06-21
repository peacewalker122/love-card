package main

import (
	"context"
)

type Database interface {
	Create(ctx context.Context, val string) error
	Find(ctx context.Context, index int) (string, error)
	FindAll(ctx context.Context) ([]string, error)
	Update(ctx context.Context, kindex int, val string) error
	Delete(ctx context.Context, index int) error
}
