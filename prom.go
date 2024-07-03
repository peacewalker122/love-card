package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// Prometheus metrics
	LettersCreated = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "app_letters_created_total",
			Help: "The total number of letters created",
		},
	)
	SearchQueries = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "app_search_queries_total",
			Help: "The total number of search queries executed",
		},
	)
	RequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "promdemo_request_duration_seconds",
			Buckets: []float64{.00005, .0005, .005, .01, .025, .05, .1, .25, .5, 1, 2.5},
		},
		[]string{"response_status"},
	)
)
