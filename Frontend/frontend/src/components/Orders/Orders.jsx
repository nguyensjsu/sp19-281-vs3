import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uniqid from "uniqid";
import Drink from "../Drink/Drink";
import Order from "./Order";
import Navbar from "./../Menu/Navbar.jsx";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";

import "./Orders.css";
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderCount: 0,
      totalAmount: 0,
      CardAmount: 0,
      Cart: [],
      displaylist: false,
      isPaid: false
    };
  }

  async componentDidMount() {
    let PORT = 3000;
    var username=localStorage.getItem('username');
    // let username = this.props.UserDetails.username;

    let userdata = {
      username: this.props.UserDetails.username
    };

    const [firstResponse, orderResponse] = await Promise.all([
      axios.get(`http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet/${username}`),
      axios.get(`http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/orders/${username}`)
    ]);
    // const orderResponse = await axios.delete(
    //   `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/order/user`,
    //   userdata
    // );
    // const orderResponse = await axios.get(

    // );
    // console.log("order", orderResponse.data);
    // console.log("order", orderResponse.data.length);

    this.setState({
      CardAmount: firstResponse.data[0].amount,
      Cart: orderResponse.data
      //  // totalAmount: parseInt(secondResponse.data.totalamount)
    });
  }

  render() {
    let redirectVar = null;
    if (this.state.isPaid) {
      redirectVar = <Redirect to="/cardpay" />;
    }
    let details = (
      <div>
        <h2>No Orders Placed</h2>
      </div>
    );
    if (
      this.state.Cart != null &&
      this.state.Cart != undefined &&
      this.state.Cart.length != undefined
    ) {
      details = this.state.Cart.map((drink, index) => {
        return (
          <Order
            orderid={drink._id}
            totalitems={drink.totalitems}
            totalamount={drink.totalamount}
          />
        );
      });
    }

    return (
      <div class="card-header">
        <Navbar />
        <div className="container">
          {redirectVar}
          <div className="heading">
            <h1>Your Order</h1>
          </div>

          <div className="cart transition is-open">
            <div className="table">
              <div className="layout-inline row th">
                <div className="col col-pro">ORDER ID</div>
                <div className="col col-qty align-center">QTY</div>
                <div className="col">Total</div>
              </div>

              {details}
            </div>
            <div />

            <Link
              to="/cardpay"
              className="btn btn-update"
              data-wdio="nextButton"
              data-effect="ripple"
              // onClick={this.handleSubmit}
            >
              Reload Card
            </Link>
            <h1> Card Balance {this.state.CardAmount}</h1>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log("State", state);
  return {
    MenuDetails: state.MenuReducer.MenuDetails,
    UserDetails: state.MenuReducer.UserDetails,
    CartDetails: state.MenuReducer.CartDetails
  };
}
export default connect(
  mapStateToProps,
  null
)(Orders);
