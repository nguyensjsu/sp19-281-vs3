import React, { Component } from "react";
import axios from "axios";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";
class CardPayment extends Component {
  constructor() {
    super();
    this.state = {
      card: 0,
      add_money: 0,
      showPaymentOptions: false
    };
  }

  componentDidMount() {
    let username = "sojan";
    axios
      .get(`http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet/${username}`)
      .then(response => {
        console.log("Status Code GET Wallet:", response);
        if (response.status === 204) {
          // user wallet doesn't exist
          let data = {
            username: sessionStorage.getItem("username"),
            wallet_amount: this.state.wallet
          };
          axios
            .post(`http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet`, data)
            .then(response => {
              console.log("Status Code POST Wallet:", response.status);
              console.log(
                "response from POST Wallet:",
                response.data[0].amount
              );
              this.setState({
                card: response.data.wallet_amount
              });
            });
        } else if (response.status === 200) {
          console.log("Status Code amount Wallet:", response.data[0].amount);
          console.log("here");
          this.setState({
            card: response.data[0].amount
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  enablePaymentOptions = () => {
    this.setState({ showPaymentOptions: true });
  };

  addAmountChangeHandler = e => {
    this.setState({ add_money: e.target.value });
  };

  addMoney = e => {
    let PORT = 3000;
    let data = {
      username: sessionStorage.getItem("username"),
      wallet_amount: parseInt(this.state.add_money)
    };
    console.log("add money:", data);
    axios
      .put(`http://${PAYMENT_HOST_ELB.Payments_ELB}/wallet/add`, data)
      .then(response => {
        console.log("response from PUT ADD MONEY", response);
        this.setState({
          wallet: response.data.wallet_amount
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div id="title">
            <h2>Starbucks Cards</h2>
            <hr />
          </div>
          <span style={{ margin: 20, fontSize: 25, fontWeight: 500 }}>
            Card Amount:{" "}
            <span style={{ fontWeight: 700 }}>${this.state.card}</span>
          </span>
          {!this.state.showPaymentOptions ? (
            <span style={{ margin: 20 }}>
              <button
                onClick={this.enablePaymentOptions}
                className="btn btn-primary"
              >
                Add Money
              </button>
            </span>
          ) : (
            ""
          )}
          {this.state.showPaymentOptions ? (
            <div
              style={{ margin: 20, width: 650 }}
              className="login-form card rounded-0"
            >
              <div className="card-header card-title">
                <h3
                  style={{
                    textAlign: "center"
                  }}
                >
                  Add Card Information
                </h3>
              </div>
              <div className="card-body">
                <div>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control form-control-lg rounded-0"
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="form-row">
                    <div className="col form-group">
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-0"
                        placeholder="Expiration Month"
                      />
                    </div>
                    <div className="col form-group">
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-0"
                        placeholder="Expiration Year"
                      />
                    </div>
                    <div className="col form-group">
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-0"
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-0"
                      placeholder="Name on the Card"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-0"
                      placeholder="Billing Address"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      onChange={this.addAmountChangeHandler}
                      type="number"
                      className="form-control form-control-lg rounded-0"
                      placeholder="Amount"
                    />
                  </div>
                  <button
                    onClick={this.addMoney}
                    className="btn btn-lg btn-block btn-login rounded-0"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default CardPayment;
