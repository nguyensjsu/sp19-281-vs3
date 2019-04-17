/*
	Cart API in Go
	Uses  Riak KV
*/

package main


type ErrorMessage struct {
	message string `json:"message"`
}



// type Items struct {
//     Name string `json:"drink_name"`
// 	Amount int `json:"drink_rate"`
//     Count int `json:"drink_quantity"`
// }

type Beverage struct {
	DrinkName		string 	`json:"drink_name" bson:"drink_name"`
	DrinkQuantity	int 	`json:"drink_quantity" bson:"drink_quantity"`
	Rate			float64 `json:"drink_rate" bson:"drink_rate"`
}

type Order struct {
	Id 			string 	`json:"_id" bson:"_id"`
	Username 	string 	`json:"username" bson:"username"`
	TotalItems 	int 	`json:"totalitems" bson:"totalitems"`
	CartTotal 	float64 `json:"totalamount" bson:"totalamount"`
	Beverages 		[]Beverage  `json:"drinks" bson:"drinks"`
}