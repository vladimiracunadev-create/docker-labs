package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type Health struct {
	OK bool   `json:"ok"`
	TS string `json:"ts"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Go API OK ✅"))
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		h := Health{OK: true, TS: time.Now().Format(time.RFC3339)}
		json.NewEncoder(w).Encode(h)
	})

	http.ListenAndServe(":8080", nil)
}