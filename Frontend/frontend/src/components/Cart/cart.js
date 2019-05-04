import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Navbar from "./../Menu/Navbar.jsx";
import uniqid from "uniqid";
import {Payments_ELB, Cart_ELB, Login_ELB, Menu_ELB} from './../../Helpers/helper.js';
import "./Cart.css";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCount: 10
    };
  }

  checkout = e => {
    console.log("Checking out");
  };

  updateCart = e => {
    console.log("Update Cart");
    console.log(this.state.cart);

    // let CART_ELB = "cart-elb-662553320.us-east-1.elb.amazonaws.com";

    let UpdatedCart = this.state.cart;

    axios
      .put(`${Cart_ELB}/cart/add`, UpdatedCart)
      .then(response => {
        console.log("Status Code :", response);
        console.log("Data updated");
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteItem = index => {
    console.log(index);
    let UpdatedCart = this.state.cart;
    let indexTemp = index;
    let newtotalAmt = 0;

    var updatedDrinks = UpdatedCart.drinks.filter(function(value, index) {
      return index != indexTemp;
    });
    UpdatedCart.drinks = updatedDrinks;

    UpdatedCart.drinks.map(drink => {
      newtotalAmt += drink.drink_rate * drink.drink_quantity;
    });

    UpdatedCart.totalamount = newtotalAmt;
    console.log(UpdatedCart);

    this.setState({
      cart: UpdatedCart,
      totalAmount: newtotalAmt
    });
  };

  decrement = index => {
    console.log(index);
    let UpdatedCart = this.state.cart;
    if (UpdatedCart.drinks[index].drink_quantity > 0) {
      let newtotalAmt = 0;

      UpdatedCart.drinks[index].drink_quantity--;

      UpdatedCart.drinks.map(drink => {
        newtotalAmt += drink.drink_rate * drink.drink_quantity;
      });

      UpdatedCart.totalamount = newtotalAmt;

      this.setState({
        cart: UpdatedCart,
        totalAmount: newtotalAmt
      });
    }
  };

  increment = index => {
    console.log(index);
    let UpdatedCart = this.state.cart;
    let newtotalAmt = 0;
    UpdatedCart.drinks[index].drink_quantity++;
    UpdatedCart.drinks.map(drink => {
      newtotalAmt += drink.drink_rate * drink.drink_quantity;
    });

    UpdatedCart.totalamount = newtotalAmt;

    this.setState({
      cart: UpdatedCart,
      totalAmount: newtotalAmt
    });
  };

  componentDidMount() {
    // let CART_ELB = "cart-elb-662553320.us-east-1.elb.amazonaws.com";
    let username = this.props.UserDetails.username;

    axios
      .get(`${Cart_ELB}/cart/${username}`)
      .then(response => {
        console.log("Status Code :", response);

        this.setState({
          cart: response.data,
          totalAmount: response.data.totalamount
        });
        console.log(this.state.cart.drinks);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    console.log("cart", this.state.cart);

    let details = null;

    if (this.state.cart != null && this.state.cart != undefined) {
      details = this.state.cart.drinks.map((drink, index) => {
        return (
          <div class="layout-inline row">
            <div class="col col-pro layout-inline">
              <p>{drink.drink_name}</p>
            </div>

            <div class="col col-price col-numeric align-center ">
              <p>${drink.drink_rate}</p>
            </div>

            <div class="col col-qty layout-inline">
              <a onClick={() => this.decrement(index)} class="qty qty-minus">
                -
              </a>
              <input
                type="numeric"
                class="col-numeric"
                value={drink.drink_quantity}
              />
              <a onClick={() => this.increment(index)} class="qty qty-plus">
                +
              </a>
            </div>

            <div class="col col-total col-numeric">
              {" "}
              <p> ${drink.drink_rate * drink.drink_quantity}</p>
            </div>
            <div class="col col-vat col-numeric">
              <button
                type="button"
                onClick={() => this.deleteItem(index)}
                class="btn-x"
                aria-label="Close"
              >
                x
              </button>
            </div>
          </div>
        );
      });
    }

    return (
      <div class="card-header">
      <Navbar/>
      <div class="container">
        <div class="heading">
          <h1>Shopping Cart</h1>
        </div>

        <div class="cart transition is-open">
          <button onClick={this.updateCart} class="btn btn-update">
            Update Cart
          </button>
          <div class="table">
            <div class="layout-inline row th">
              <div class="col col-pro">DRINK</div>
              <div class="col col-price align-center ">Price</div>
              <div class="col col-qty align-center">QTY</div>
              <div class="col">Total</div>
              <div class="col">Delete</div>
            </div>

            {details}

            <div class="tf">
              <div class="row layout-inline">
                <div class="col">
                  <p>Total</p>
                </div>
                <div class="col">
                  <p>${this.state.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/payments"
            className="btn btn-update"
            data-wdio="nextButton"
            data-effect="ripple"
            // onClick={this.handleSubmit}
          >
            Proceed to Payment
          </Link>
        </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
    console.log("State",state);
      return {
         MenuDetails: state.MenuReducer.MenuDetails,
         UserDetails: state.MenuReducer.UserDetails,
         CartDetails: state.MenuReducer.CartDetails
      };
  }
export default connect(mapStateToProps, null)(Cart);
