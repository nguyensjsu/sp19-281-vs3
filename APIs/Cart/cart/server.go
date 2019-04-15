package main

import(
	"fmt"
	"net/http"
	"io/ioutil"
	"time"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

var debug = true

var elb = "http://internal-riak-cart-elb-489823230.us-west-1.elb.amazonaws.com:80"

var tr = &http.Transport{
	MaxIdleConns:       10,
	IdleConnTimeout:    30 * time.Second,
	DisableCompression: true,
}

func NewClient(server string) *Client {
	return &Client{
		Endpoint:  	server,
		Client: 	&http.Client{Transport: tr},
	}
}

func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.UseHandler(mx)
	return n
}


func (c *Client) Ping() (string, error) {
	resp, err := c.Get(c.Endpoint + "/ping" )
	if err != nil {
		fmt.Println("[RIAK DEBUG] " + err.Error())
		return "Ping Error!", err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if debug { fmt.Println("[RIAK DEBUG] GET: " + c.Endpoint + "/ping => " + string(body)) }
	return string(body), nil
}

func initRoutes(mx *mux.Router, formatter *render.Render) {

	mx.HandleFunc("/ping", PingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/cart", getCartHandler(formatter)).Methods("GET")
	
}

func PingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"API Cart running!"})
	}
}

// Handle new order request
func newOrderHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		var newCart Cart
		uuid, _ := uuid.NewV4()
		fmt.Println(req.Body)
		decoder := json.NewDecoder(req.Body)
		fmt.Println(decoder)

	}
}

// Handle new order request
func getCartHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

				params := mux.Vars(req)
				var uuid string = params["id"]
				// fmt.Println( "Order Params ID: ", uuid )
		
				if uuid == "" {
					formatter.JSON(w, http.StatusBadRequest, "Invalid Request. Order ID Missing.")
				} else {
		
		//			c := NewClient(elbcart)
		
					ord := c.GetOrder(uuid)
		
					if ord.Id == "" {
						formatter.JSON(w, http.StatusBadRequest, "")
					} else {
						fmt.Println("Order Details: ", ord)
						formatter.JSON(w, http.StatusOK, ord)
					}
				}

		
	}
}

func getOrderHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		params := mux.Vars(req)
		var userid string = params["id"]	
		fmt.Println( "Order Params ID: ", userid )

		if userid == "" {
			formatter.JSON(w, http.StatusBadRequest, "Invalid Request. Order ID Missing.")
		} else {
			c := NewClient(elbcart)

			ord := c.GetOrder(userid)

				fmt.Println("Order Details: ", ord)
				formatter.JSON(w, http.StatusOK, ord)
			}
		}
	}