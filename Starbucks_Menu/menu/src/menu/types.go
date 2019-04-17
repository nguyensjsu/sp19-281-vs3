package main

// Menu Item structure
type Item struct {
	itemId							string
	itemName		    		string
	itemSummary 				string
	itemDescription 		string
	itemAmount		    	float32
	itemCalorieContent	string
	// itemAvailable				bool
}

type MenuItem struct {

	itemId							string
	itemName		    		string
	itemSummary 				string
	itemDescription 		string
	itemAmount		    	float32
	itemCalorieContent	string
	itemImagePath   		string
	itemAvailable				bool
}

type deleteMenuItem struct {
	itemId							string
}
