import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uniqid from "uniqid";
import "./Cart.css";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCount: 10,
      totalAmount: 0
    };
  }

  updateCart = e => {
    console.log("Update Cart");
    console.log(this.state.cart);
  };

  decrement = name => {
    console.log(this.state.cart.drinks.length);
  };

  increment = name => {
    console.log(name);
  };

  componentDidMount() {
    let CART_ELB = "cartelb2-1994013311.us-east-1.elb.amazonaws.com";

    let PORT = 3000;
    let username = "sojan";

    axios
      .get(`http://${CART_ELB}/cart/${username}`)
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
      details = this.state.cart.drinks.map(drink => {
        return (
          <div class="layout-inline row">
            <div class="col col-pro layout-inline">
              <img
                src="http://static.ddmcdn.com/gif/10-kitten-cuteness-1.jpg"
                alt="kitten"
              />
              <p>{drink.drink_name}</p>
            </div>

            <div class="col col-price col-numeric align-center ">
              <p>${drink.drink_rate}</p>
            </div>

            <div class="col col-qty layout-inline">
              <a
                onClick={() => this.decrement(drink.drink_name)}
                class="qty qty-minus"
              >
                -
              </a>
              <input type="numeric" value={drink.drink_quantity} />
              <a
                onClick={this.increment(drink.drink_name)}
                class="qty qty-plus"
              >
                +
              </a>
            </div>

            <div class="col col-vat col-numeric">
              <p>£2.95</p>
            </div>
            <div class="col col-total col-numeric">
              {" "}
              <p> £182.95</p>
            </div>
          </div>
        );
      });
    }

    return (
      <div class="container">
        <div class="heading">
          <h1>
            <span class="shopper">s</span> Shopping Cart
          </h1>

          <a href="this." class="visibility-cart transition is-open">
            X
          </a>
        </div>

        <div class="cart transition is-open">
          <a href="#" class="btn btn-update">
            Update cart
          </a>

          <div class="table">
            <div class="layout-inline row th">
              <div class="col col-pro">DRINK</div>
              <div class="col col-price align-center ">Price</div>
              <div class="col col-qty align-center">QTY</div>
              <div class="col">VAT</div>
              <div class="col">Total</div>
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

          <button onClick={this.updateCart} class="btn btn-update">
            Update cart
          </button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  null
)(Cart);
