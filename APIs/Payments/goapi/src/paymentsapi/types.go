package main

type Wallet struct {
	Username 	string 	`json:"username" bson:"username"`
	Amount		float64 `json:"amount" bson:"amount"`
}

