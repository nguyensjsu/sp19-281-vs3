package main

import (
//"encoding/json"
//"fmt"
//"log"
//"math"
"net/http"
"github.com/codegangsta/negroni"
"github.com/gorilla/mux"
"github.com/unrolled/render"
"github.com/rs/cors"
//"github.com/satori/go.uuid"
//"gopkg.in/mgo.v2"
//"gopkg.in/mgo.v2/bson"
)


// NewServer configures and returns a server
func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	corsObj := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowedHeaders: []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.Use(corsObj)
	n.UseHandler(mx)
	return n
}

func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Result string }{"Purchase API version 1.0 alive!"})
	}
}