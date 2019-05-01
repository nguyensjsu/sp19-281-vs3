import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uniqid from "uniqid";
import Drink from "../Drink/Drink";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";

import "./Payments.css";
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCount: 0,
      orderPrice: 0
    };
  }

  componentDidMount() {
    // let PAYMENT_HOST_ELB =

    let username = "sojan";

    axios
      .get(`http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet/${username}`)
      .then(response => {
        console.log("Status Code GET Wallet:", response);
        this.setState({ wallet: response.data[0].amount });
        console.log(this.state.wallet);
      })
      .catch(err => {
        console.log(err);
      });

    console.log("component did mount ", this.state);
    var photos = [];
    const data = {
      orderid: this.props.orderid
    };

    console.log("DATA", data);

    axios
      .get(`http://${PAYMENT_HOST_ELB.Cart_ELB}/${username}`)
      .then(async response => {
        console.log("cart data", JSON.stringify(response.data));

        this.setState({
          Cart: response.data.drinks,
          totalAmount: response.data.totalamount,
          displaylist: true
        });
      });
  }

  pay() {
    // let PORT = 3000;
    let data = {
      username: "sojan",
      amount: this.state.cart_total
    };
    axios
      .put(`http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet/pay`, data)
      .then(response => {
        console.log("Status Code POST Wallet:", response.status);
        console.log("response from POST Wallet:", response);
        this.setState({
          wallet: response.data.amount
        });
      });
    console.log("cart", this.state.cart);
    data = {
      username: sessionStorage.getItem("username"),
      items: this.state.cart,
      cart_total: this.state.cart_total
    };
  }

  render() {
    let details = null;

    if (this.state.Cart != null && this.state.Cart != undefined) {
      details = this.state.Cart.map((drink, index) => {
        return (
          <div class="layout-inline row">
            <div class="col col-pro layout-inline">
              <p>{drink.drink_name}</p>
            </div>

            <div class="col col-price col-numeric align-center ">
              <p>${drink.drink_rate}</p>
            </div>

            <div class="col col-qty layout-inline">{drink.drink_quantity}</div>

            <div class="col col-total col-numeric">
              {" "}
              <p> ${drink.drink_rate * drink.drink_quantity}</p>
            </div>
            <div class="col col-vat col-numeric" />
          </div>
        );
      });
    }

    return (
      <div class="container">
        <div class="heading">
          <h1>Your Order</h1>
        </div>

        <div class="cart transition is-open">
          <div class="table">
            <div class="layout-inline row th">
              <div class="col col-pro">DRINK</div>
              <div class="col col-price align-center ">Price</div>
              <div class="col col-qty align-center">QTY</div>
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

          <button onClick={this.pay} class="btn btn-update">
            Pay from Card
          </button>
          <Link
            to="/cardpay"
            className="btn btn-update"
            data-wdio="nextButton"
            data-effect="ripple"
            // onClick={this.handleSubmit}
          >
            Reload Card
          </Link>
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
)(Payment);
