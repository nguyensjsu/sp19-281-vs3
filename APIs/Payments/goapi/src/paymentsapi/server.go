package main

import (
	//"encoding/json"
	"fmt"
	//"log"
//	"math"
	"net/http"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"github.com/rs/cors"
	//"github.com/satori/go.uuid"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)



//Mongo config
var mongodb_server = "127.0.0.1:27017"
//	"admin:cmpe281@10.0.1.14:27017,10.0.1.246:27017,10.0.1.192:27017,10.0.1.148:27017,10.0.1.171:27017"
var mongodb_database 			= "payments"
var mongodb_wallet_collection   = "wallet"
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

//API routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")

	mx.HandleFunc("/wallet/{username}", getWalletHandler(formatter)).Methods("GET")

}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Result string }{"Payments API version 1.0 alive!"})
	}
}

// API Get Wallet Handler - Get Wallet for a specified user
func getWalletHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		params := mux.Vars(req)
		var username string = params["username"]
		fmt.Println("username:", username)
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_wallet_collection)

		var wallet []bson.M
		err = c.Find(bson.M{"username":username}).All(&wallet)

		if err != nil {
			fmt.Println("Error searching DB for wallet: ", err)
		} else {
			fmt.Println("Wallet:", wallet)
			if (wallet == nil) {
				formatter.JSON(w, http.StatusNoContent, struct{ Result string }{"No wallet for this user"})
			} else {
				fmt.Println("Wallet: ", wallet)
				formatter.JSON(w, http.StatusOK, wallet)
			}

		}
	}
}