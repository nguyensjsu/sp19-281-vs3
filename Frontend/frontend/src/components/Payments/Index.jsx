import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uniqid from "uniqid";
import Drink from "../Drink/Drink";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";
import Navbar from "./../Menu/Navbar.jsx";
import "./Payments.css";
class Payment extends Component {
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
    let username = localStorage.getItem('username');
    //let username = "sojan";
    const [firstResponse, secondResponse] = await Promise.all([
      axios.get(
        `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet/${username}`
      ),
      axios.get(`${PAYMENT_HOST_ELB.Cart_ELB}/cart/${username}`)
    ]);
    console.log("firstResponse", firstResponse);
    console.log("secondResponse", secondResponse);

    this.setState({
      CardAmount:
        firstResponse.status == 204 ? 0 : firstResponse.data[0].amount,
      Cart: secondResponse.data.drinks,
      totalitems: secondResponse.data.totalitems,
      totalAmount: parseInt(secondResponse.data.totalamount)
    });
  }

  // async componentDidMount() {
  //   // let PAYMENT_HOST_ELB =

  //   let username = "Srini";
  //   //let { data } = await axios.get(url);

  //   try {
  //     let { data } = await axios.get(
  //       `http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet/${username}`
  //     );
  //     console.log("data", data);
  //     let { cartdata } = await axios.get(
  //       `http://${PAYMENT_HOST_ELB.Cart_ELB}/${username}`
  //     );
  //     console.log("cartydata", cartdata);
  //   } catch (error) {
  //     //
  //   }

  //   // .then(response => {
  //   //   console.log("Status Code GET Wallet:", response);
  //   //   this.setState({ wallet: response.data[0].amount });
  //   //   console.log(this.state.wallet);
  //   // })
  //   // .catch(err => {
  //   //   console.log(err);
  //   // });

  //   // console.log("component did mount ", this.state);
  //   // var photos = [];
  //   // const data = {
  //   //   orderid: this.props.orderid
  //   // };

  //   //  console.log("DATA", data);

  //   // console.log("Carty", cartdata);
  //   // axios
  //   //   .get(`http://${PAYMENT_HOST_ELB.Cart_ELB}/${username}`)
  //   //   .then(async response => {
  //   //     console.log("cart data", JSON.stringify(response.data));

  //   //     this.setState({
  //   //       Cart: response.data.drinks,
  //   //       totalAmount: response.data.totalamount,
  //   //       displaylist: true
  //   //     });
  //   //     console.log("this.state", this.state);
  //   //   });
  // }

  pay = async event => {
    let PORT = 3000;
    event.preventDefault();
    if (this.state.CardAmount <= 0) {
      window.alert(
        "Insufficient card balance. Please reload your Starbucks Card"
      );
    } else {
      let data = {
        username: localStorage.getItem('username'),
        amount: this.state.totalAmount
      };
      let processpayData = {
        username: localStorage.getItem('username'),
        totalitems: this.state.totalitems,
        totalamount: this.state.totalAmount,
        drinks: this.state.Cart
      };
      console.log("processpayData", processpayData);

      const paymentResponse = await axios.put(
        `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet/pay`,
        data
      );

      console.log("paymentResponse", paymentResponse);
      if (paymentResponse.status == 200) {
        const [processPaymentResp, cartclearResp] = await Promise.all([
          axios.post(
            `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/payment`,
            processpayData
          ),
          axios.delete(`${PAYMENT_HOST_ELB.Cart_ELB}/cart/${data.username}`)
        ]);
        console.log("processPaymentResp", processPaymentResp.data);
        console.log("cartclearResp", cartclearResp);

        if (processPaymentResp.status == 200) {
          localStorage.setItem("orderid", processPaymentResp.data._id);
        }

        window.alert("Payment successfull");
        // const cartclearResp = await axios.delete(
        //   `http://${PAYMENT_HOST_ELB.Cart_ELB}/${data.username}`
        // );
        console.log("cartclearResp", cartclearResp);
        if (cartclearResp.status == 200) {
          this.setState({
            isPaid: true
          });
        }
      }
    }
    // console.log("cart", this.state.cart);
    // data = {
    //   username: sessionStorage.getItem("username"),
    //   items: this.state.cart,
    //   cart_total: this.state.cart_total
    // };
  };

  render() {
    let redirectVar = null;
    if (this.state.isPaid) {
      redirectVar = <Redirect to="/order" />;
    }
    let details = null;
    // let details = (
    //   <div>
    //     <h2>No Payments Pending</h2>
    //   </div>
    // );
    if (this.state.Cart != null && this.state.Cart != undefined) {
      details = this.state.Cart.map((drink, index) => {
        return (
          <div className="layout-inline row">
            <div className="col col-pro layout-inline">
              <p>{drink.drink_name}</p>
            </div>

            <div className="col col-price col-numeric align-center ">
              <p>${drink.drink_rate}</p>
            </div>

            <div className="col col-qty layout-inline">
              {drink.drink_quantity}
            </div>

            <div className="col col-total col-numeric">
              {" "}
              <p> ${drink.drink_rate * drink.drink_quantity}</p>
            </div>
            <div className="col col-vat col-numeric" />
          </div>
        );
      });
    }

    return (
      <div className="card-header">
        <Navbar />
        <div className="container">
          {redirectVar}

          <div className="heading">
            <h1>Your Order</h1>
          </div>

          <div className="cart transition is-open">
            <div className="table">
              <div className="layout-inline row th">
                <div className="col col-pro">DRINK</div>
                <div className="col col-price align-center ">Price</div>
                <div className="col col-qty align-center">QTY</div>
                <div className="col">Total</div>
              </div>

              {details}

              <div className="tf">
                <div className="row layout-inline">
                  <div className="col">
                    <p>Total</p>
                  </div>
                  <div className="col">
                    <p>${this.state.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
            <div />

            <button
              onClick={event => this.pay(event)}
              className="btn btn-update"
            >
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
)(Payment);
