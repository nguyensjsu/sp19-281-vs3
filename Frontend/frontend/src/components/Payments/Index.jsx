import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uniqid from "uniqid";
import Drink from "../Drink/Drink";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";
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
    console.log("properties", this.state.Cart);
    if (this.state.displaylist) {
      return (
        <div>
          <div>
            {this.state.Cart.map((property, index) => {
              return (
                <Drink
                  headline={property.drink_name}
                  key={property.prop_id}
                  value={property.prop_id}
                  bath={property.drink_quantity}
                  bed={property.drink_rate}
                  unit={property.drink_quantity}
                  clicked={this.handleClick}
                  houseType={property.houseType}
                  capacity={property.capacity}
                  rate={property.rate}
                  imgsrc={"data:image/png;base64," + property.photo}
                />
              );
            })}
          </div>
          <button onClick={this.pay} className="btn btn-primary">
            Pay from Wallet
          </button>
        </div>
      );
    } else
      return (
        <div>
          <p>No orders found</p>
          <button onClick={this.pay} className="btn btn-primary">
            Pay from Card
          </button>
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
