package main

import (
	"context"
	"project/gen/go/card/v1"
	project "project/src/database/gen"
	"project/src/helper"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type Server struct {
	card.UnimplementedYourServiceServer
	q *project.Queries
}

func NewServer(db project.DBTX) card.YourServiceServer {
	return &Server{
		q: project.New(db),
	}
}

func (s *Server) CreateCard(ctx context.Context, req *card.StringMessage) (*card.StringMessage, error) {
	created_at := pgtype.Timestamptz{
		Time: time.Now().UTC(),
	}

	result, err := s.q.CreateCard(ctx, project.CreateCardParams{
		Letter:    req.Letter,
		CreatedAt: time.Now().UTC(),
		Author:    req.Author,
	})
	if err != nil {
		return nil, err
	}

	return &card.StringMessage{
		Letter:    result.Letter,
		CreatedAt: helper.Int64P(created_at.Time.Unix()),
		Author:    req.Author,
	}, nil
}

func (s *Server) GetAllCard(ctx context.Context, req *card.IDRequest) (*card.RepeatedStringMessage, error) {
	res, err := s.q.GetCard(ctx,req.Value)
	if err != nil {
		return nil, err
	}

	result := make([]*card.StringMessage, len(res))

	for i, v := range res {
		result[i] = &card.StringMessage{
			Letter:    v.Letter,
			CreatedAt: helper.Int64P(v.CreatedAt.Unix()),
			Author:    v.Author,
		}
	}

	return &card.RepeatedStringMessage{
		Value: result,
	}, nil
}
