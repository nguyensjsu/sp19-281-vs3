package main

import (
	"encoding/json"
	"log"
	"math"
	"fmt"
	//"log"
	//	"math"
	"net/http"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"github.com/rs/cors"
	"github.com/satori/go.uuid"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)



//Mongo config
//var mongodb_server = "127.0.0.1:27017"

//var mongodb_server = 	 "admin:cmpe281@10.0.1.14:27017,10.0.1.246:27017,10.0.1.192:27017,10.0.1.148:27017,10.0.1.171:27017"

//VPC Peer
//var mongodb_server = "admin:cmpe281@10.0.1.167:27017,10.0.1.61:27017,10.0.1.41:27017,172.0.1.66:27017,172.0.1.221:27017"

//EKS
var mongodb_server = "admin:cmpe281@34.209.212.52:27017,54.191.209.32:27017,54.185.31.34:27017,100.27.36.176:27017,34.200.228.221:27017"


var mongodb_database 			= "payments"
var mongodb_wallet_collection   = "wallet"
var mongodb_orders_collection = "order"

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
	mx.HandleFunc("/orders", getOrdersHandler(formatter)).Methods("GET")
	mx.HandleFunc("/payment", paymentHandler(formatter)).Methods("POST")
	mx.HandleFunc("/orders/{username}", getOrdersByUserHandler(formatter)).Methods("GET")
	mx.HandleFunc("/order/id", deletePaymentByIdHandler(formatter)).Methods("DELETE")
	mx.HandleFunc("/order/user", deletePaymentsByUserHandler(formatter)).Methods("DELETE")
	mx.HandleFunc("/wallet/{username}", getWalletHandler(formatter)).Methods("GET")
	mx.HandleFunc("/wallet", addWalletHandler(formatter)).Methods("POST")
	mx.HandleFunc("/wallet/add", addMoneyToWalletHandler(formatter)).Methods("PUT")
	mx.HandleFunc("/wallet/pay", payWalletHandler(formatter)).Methods("PUT")
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


// API Payments Handler - Get all orders
func getOrdersHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_orders_collection)

		var orders []bson.M
		err = c.Find(nil).All(&orders)
		if (err != nil || orders == nil) {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"No purchases yet!"})
		} else {
			fmt.Println("All orders: ", orders)
			formatter.JSON(w, http.StatusOK, orders)
		}
	}
}

// API Orders By User Handler - Get all orders from a specified user
func getOrdersByUserHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		params := mux.Vars(req)
		var username string = params["username"]
		session, err := mgo.Dial(mongodb_server)

		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_orders_collection)

		var orders []bson.M
		err = c.Find(bson.M{"username":username}).All(&orders)
		if (err != nil || orders == nil){
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"No purchases from this user"})
		} else {
			fmt.Println("All purchases: ", orders)
			formatter.JSON(w, http.StatusOK, orders)
		}
	}


}
// API Add Wallet Handler - Create Wallet for a specified user
func addWalletHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		decoder := json.NewDecoder(req.Body)
		var body Wallet
		err := decoder.Decode(&body)
		fmt.Println("body:", req.Body)
		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		}

		session, err := mgo.Dial(mongodb_server)

		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_wallet_collection)
		entry := Wallet{body.Username, body.Amount}
		err = c.Insert(entry)

		if err != nil {
			formatter.JSON(w, http.StatusNoContent, struct{ Result string }{"No wallet for this user"})
		} else {
			jData, _ := json.Marshal(entry)
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jData)
		}
	}
}

// API Pay Wallet Handler - Pay using the wallet for a specified user
func payWalletHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		decoder := json.NewDecoder(req.Body)
		var body Wallet
		err := decoder.Decode(&body)

		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		}

		session, err := mgo.Dial(mongodb_server)

		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_wallet_collection)

		var currentWallet bson.M
		err = c.Find(bson.M{"username": body.Username}).One(&currentWallet)

		if (err != nil) {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"No wallet for this user"})
		} else {
			currentAmount := currentWallet["amount"].(float64)
			query := bson.M{"username": body.Username}
			newAmount := currentAmount - body.Amount
			newAmount = math.Floor(newAmount*100) / 100
			change := bson.M{"$set": bson.M{"amount": newAmount}}
			err = c.Update(query, change)

			if err != nil {
				log.Fatal(err)
			} else {
				fmt.Print("Wallet now has $", newAmount, "\n")
				_ = c.Find(bson.M{"username": body.Username}).One(&currentWallet)
				jData, _ := json.Marshal(currentWallet)
				w.WriteHeader(http.StatusOK)
				w.Header().Set("Content-Type", "application/json")
				w.Write(jData)
			}
		}
	}
}

// API Add Money to Wallet Handler - Add money to the wallet for a specified user
func addMoneyToWalletHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		decoder := json.NewDecoder(req.Body)
		var body Wallet
		err := decoder.Decode(&body)

		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		}

		session, err := mgo.Dial(mongodb_server)

		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_wallet_collection)

		var currentWallet bson.M
		err = c.Find(bson.M{"username" : body.Username}).One(&currentWallet)

		if (err != nil) {
			formatter.JSON(w, http.StatusNoContent, struct{ Result string }{"No wallet for this user"})
		} else {
			currentAmount := currentWallet["amount"].(float64)
			query := bson.M{"username" : body.Username}
			newAmount := currentAmount + body.Amount
			newAmount = math.Floor(newAmount*100)/100
			change := bson.M{"$set": bson.M{ "amount" : newAmount}}
			err = c.Update(query, change)

			if err != nil {
				log.Fatal(err)
			} else {
				fmt.Print("Wallet now has $",newAmount,"\n")
				_ = c.Find(bson.M{"username" : body.Username}).One(&currentWallet)
				jData, _ := json.Marshal(currentWallet)
				w.WriteHeader(http.StatusOK)
				w.Header().Set("Content-Type", "application/json")
				w.Write(jData)
			}
		}
	}
}


// API Payment Handler - Insert a new order after payment
func paymentHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		var totalItems int

		decoder := json.NewDecoder(req.Body)
		var t Order
		err := decoder.Decode(&t)
		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		} else {
			for _, item := range t.Beverages {
				totalItems += item.DrinkQuantity
			}
		}	

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_orders_collection)

		uuid, _ := uuid.NewV4()
		entry := Order{uuid.String(),
			t.Username,
			t.TotalItems,
			t.CartTotal,
			t.Beverages}
		err = c.Insert(entry)

		if err != nil {
			fmt.Println("Error while inserting purchase: ", err)
		} else {
			jData, _ := json.Marshal(entry)
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jData)
		}
	}
}
// API Delete Payments By User Handler - Delete all payments made by a specified user
func deletePaymentsByUserHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		decoder := json.NewDecoder(req.Body)
		var t Order
		err := decoder.Decode(&t)
		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		}

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}

		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_orders_collection)

		_, err = c.RemoveAll(bson.M{"username":t.Username})
		if err != nil {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"No purchases from this user"})
		} else {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"Orders deleted"})
		}
	}
}


// API Delete Payment By Id Handler - Delete a single payment with specified id
func deletePaymentByIdHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		decoder := json.NewDecoder(req.Body)
		var t Order
		err := decoder.Decode(&t)
		if err != nil {
			fmt.Println("Error parsing the request's body: ", err)
		}

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_orders_collection)

		err = c.Remove(bson.M{"_id":t.Id})

		if err != nil {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"No purchase with this id"})
		} else {
			formatter.JSON(w, http.StatusOK, struct{ Result string }{"Purchase deleted"})
		}
	}
}

