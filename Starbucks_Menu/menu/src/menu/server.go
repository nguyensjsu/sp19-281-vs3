package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"github.com/satori/go.uuid"
	"github.com/gorilla/handlers"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"net"
	"strings"
	"os"
)

var database_server = os.Getenv("127.0.0.1:27017")
var database = os.Getenv("cmpe281")
var collection = os.Getenv("Menu")




// MenuServer configures and returns a MenuServer instance.
func MenuServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	router := mux.NewRouter()
	initRoutes(router, formatter)
	allowedHeaders := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD","DELETE","OPTIONS"})
	allowedOrigins := handlers.AllowedOrigins([]string{"*"})

	n.UseHandler(handlers.CORS(allowedHeaders,allowedMethods , allowedOrigins)(router))
	return n
}

// Menu Service API Routes
func initRoutes(router *mux.Router, formatter *render.Render) {
	router.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	router.HandleFunc("/menu/item", createItemHandler(formatter)).Methods("POST")
	router.HandleFunc("/menu/item/{itemId}", getItem(formatter)).Methods("GET")
	router.HandleFunc("/menu/items", getItemList(formatter)).Methods("GET")
	router.HandleFunc("/menu/item/{itemId}", updateItemHandler(formatter)).Methods("PUT")
	router.HandleFunc("/menu/item/{itemId}", deleteItemHandler(formatter)).Methods("DELETE")
}

// Error Helper Functions
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

// Menu Serivce Health Check API

func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"API version 1.0 alive!"})
	}
}

func createItemHandler(formatter *render.Render) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		var menuItem MenuItem
		_ = json.NewDecoder(request.Body).Decode(&menuItem)
    	fmt.Println("Item Payload ", menuItem)
    	uuid := uuid.NewV4()
    	menuItem.itemId = uuid.String()
    	session, err := mgo.Dial(database_server)
        if err != nil {
            formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
            return
        }
       defer session.Close()

       mongo_collection := session.DB(database).C(collection)

       var menu Menu;
       err = mongo_collection.Find(bson.M{"itemId" : menuItem.itemId}).One(&menu)
       if err != nil {
              fmt.Println("error: ", err)
             	menu.itemId = menuItem.itemId
             	menu.itemName = menuItem.itemName
							menu.itemSummary = menuItem.itemSummary
							menu.itemDescription = menuItem.itemDescription
							menu.itemAmount = menuItem.itemAmount
							menu.itemCalorieContent = menuItem.itemCalorieContent

            error := mongo_collection.Insert(menu)
            fmt.Println("error: ", error)
            if error != nil {
                formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
                return
            }

        }else{
              formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
              return
        }
		formatter.JSON(response, http.StatusOK, menu)
	}
}
