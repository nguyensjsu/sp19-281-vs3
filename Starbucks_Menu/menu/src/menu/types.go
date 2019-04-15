package main

// Menu Item structure
type Item struct {

	itemId							string
	itemName		    		string
	itemSummary 				int
	itemDescription 		string
	itemAmount		    	int
	itemCalorieContent	int
	itemImagePath   		string
	itemAvailable				bool
}

type menuItem struct {

	itemId							string
	itemName		    		string
	itemSummary 				int
	itemDescription 		string
	itemAmount		    	int
	itemCalorieContent	int
	itemImagePath   		string
	itemAvailable				bool
}

type deleteMenuItem struct {
	itemId							string
}
