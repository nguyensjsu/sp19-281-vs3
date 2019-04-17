import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import uniqid from "uniqid";

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let PAYMENT_HOST_ELB = "127.0.0.1";
    //   "Payments-EKS-2070687438.us-west-2.elb.amazonaws.com";

    let PORT = 3000;
    let username = "sojan";
    // sessionStorage.getItem("username");
    axios
      .get(`http://${PAYMENT_HOST_ELB}:${PORT}/wallet/${username}`)
      .then(response => {
        console.log("Status Code GET Wallet:", response);
        this.setState({ wallet: response.data[0].amount });
        console.log(this.state.wallet);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <div>
          <span style={{ fontSize: 25, fontWeight: 500 }}>
            My Card:{" "}
            <span style={{ fontWeight: 700 }}>${this.state.wallet}</span>
          </span>
          <span style={{ margin: 20 }}>
            <button onClick={this.pay} className="btn btn-primary">
              Pay from Card
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default Payment;
