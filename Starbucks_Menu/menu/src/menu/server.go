package main

import (
	"fmt"
	"log"
	// "math"
	"net/http"
	"encoding/json"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"github.com/satori/go.uuid"
	// "github.com/gorilla/handlers"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"github.com/rs/cors"
)

// var database_server = os.Getenv("127.0.0.1:27017")
// var database = os.Getenv("cmpe281")
// var collection = os.Getenv("Menu")



var database_server = "127.0.0.1:27017"
var database 			= "cmpe281"
var collection = "Menu"


// MenuServer configures and returns a MenuServer instance.
func MenuServer() *negroni.Negroni {
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

// API for creating an item in the menu

// func createItemHandler(formatter *render.Render) http.HandlerFunc {
// 	return func(response http.ResponseWriter, request *http.Request) {
// 		var menuItem MenuItem
// 		_ = json.NewDecoder(request.Body).Decode(&menuItem)
//     	fmt.Println("Item Payload on create Item handler", menuItem)
//     	uuid,_	 := uuid.NewV4()
//     	menuItem.itemId = uuid.String()
//     	session, err := mgo.Dial(database_server)
//         if err != nil {
//             formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
//             return
//         }
//        defer session.Close()
//
//        mongo_collection := session.DB(database).C(collection)
//
//        var item Item;
//        err = mongo_collection.Find(bson.M{"itemId" : menuItem.itemId}).One(&item)
//        if err != nil {
//               fmt.Println("error: ", err)
//              	item.itemId = menuItem.itemId
//              	item.itemName = menuItem.itemName
// 							item.itemSummary = menuItem.itemSummary
// 							item.itemDescription = menuItem.itemDescription
// 							item.itemAmount = menuItem.itemAmount
// 							item.itemCalorieContent = menuItem.itemCalorieContent
// 							item.itemAvailable = true
//             error := mongo_collection.Insert(item)
//             fmt.Println("error: ", error)
//             if error != nil {
//                 formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
//                 return
//             }
//         }else{
//               formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
//               return
//         }
// 		formatter.JSON(response, http.StatusOK, item)
// 	}
// }


func createItemHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		// var menuItem MenuItem

		decoder := json.NewDecoder(req.Body)
		var t Item
		err := decoder.Decode(&t)
		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		} else {
				fmt.Println("Item Payload on create Item handler", t)
		}

		session, err := mgo.Dial(database_server)
		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(database_server).C(collection)

		uuid, _ := uuid.NewV4()
		entry := Item{uuid.String(),
			t.itemName,
			t.itemSummary,
			t.itemDescription,
			t.itemAmount,
			t.itemCalorieContent,
		}
		err = c.Insert(entry)

		if err != nil {
			fmt.Println("Error while inserting purchase: ", err)
			formatter.JSON(w, http.StatusInternalServerError,"Internal Server Error")
			return
		} else {
			jData, _ := json.Marshal(entry)
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jData)
		}
	}
}

// API for getting list of all items in the menu

func getItemList(formatter *render.Render) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		session, err := mgo.Dial(database_server)
        if err != nil {
            formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
            return
        }
        defer session.Close()
        mongo_collection := session.DB(database).C(collection)
        var result bson.M
        err = mongo_collection.Find(bson.M{}).One(&result)
        if err != nil {
            formatter.JSON(response, http.StatusNotFound, "No item found!!!")
            return
        }
		formatter.JSON(response, http.StatusOK, result)
	}
}

// API for getting an item from the menu

func getItem(formatter *render.Render) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		params := mux.Vars(request)
		var itemId string = params["itemId"]
		fmt.Println( "Item ID: ", itemId )
		session, err := mgo.Dial(database_server)
        if err != nil {
            formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
            return
        }
        defer session.Close()
        mongo_collection := session.DB(database).C(collection)
        var result bson.M
        err = mongo_collection.Find(bson.M{"itemId" : itemId}).One(&result)
        if err != nil {
            formatter.JSON(response, http.StatusNotFound, "No item found with given id !!!")
            return
        }
		formatter.JSON(response, http.StatusOK, result)
	}
}

// API for updating an item from the menu

func updateItemHandler(formatter *render.Render) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		var menuItem MenuItem
		_ = json.NewDecoder(request.Body).Decode(&menuItem)
    	fmt.Println("Item Payload ", menuItem)
    	session, err := mgo.Dial(database_server)
        if err != nil {
            formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
            return
        }
        defer session.Close()
       mongo_collection := session.DB(database).C(collection)

       	var item Item;
        err = mongo_collection.Find(bson.M{"itemId" : menuItem.itemId}).One(&item)
        if err != nil {
            fmt.Println("error: ", err)
            formatter.JSON(response, http.StatusNotFound, "No item found with given id !!!")
        	return
        }else{
			  error := mongo_collection.Update(bson.M{"itemId": item.itemId}, bson.M{"$set": bson.M{"itemName": item.itemName,
					"itemSummary": item.itemSummary,"itemDescription": item.itemDescription,"itemAmount": item.itemAmount,
					"itemCalorieContent": item.itemCalorieContent}})
        	if error != nil {
        		fmt.Println("error: ", error)
                formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
                return
        	}
        }
		formatter.JSON(response, http.StatusOK, item)
	}
}


// API to delete an item from menu

func deleteItemHandler(formatter *render.Render) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		var menuItem deleteMenuItem
		_ = json.NewDecoder(request.Body).Decode(&menuItem)
    	fmt.Println("Item Payload ", menuItem)
    	session, err := mgo.Dial(database_server)
        if err != nil {
            formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
            return
        }
        defer session.Close()
        mongo_collection := session.DB(database).C(collection)

       	var item Item;
        err = mongo_collection.Find(bson.M{"itemId" : menuItem.itemId}).One(&item)
        if err != nil {
            fmt.Println("error: ", err)
            formatter.JSON(response, http.StatusNotFound, "No item found with given id !!!")
        	return
        }else{
        	error := mongo_collection.Update(bson.M{"itemId": item.itemId}, bson.M{"$set": bson.M{"itemAvailable": false}})
        	if error != nil {
        		fmt.Println("error: ", error)
                formatter.JSON(response, http.StatusInternalServerError, "Internal Server Error")
                return
        	}
        }
		formatter.JSON(response, http.StatusOK, item)
	}
}
