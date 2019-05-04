import React, { Component } from "react";
import axios from "axios";
import * as PAYMENT_HOST_ELB from "../../Helpers/helper";
import { connect } from "react-redux";
import Navbar from "./../Menu/Navbar.jsx";
class CardPayment extends Component {
  constructor() {
    super();
    this.state = {
      card: 0,
      updatedAmount: 0,
      showPaymentOptions: false
    };
    this.inputHandler = this.inputHandler.bind(this);
  }

  async componentDidMount() {
    let PORT = 3000;
    console.log("card pay");
    // let username = "Srini";
    let username = localStorage.getItem('username');
    const userwalletcheck = await axios.get(
      `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet/${username}`
    );

    console.log("userwalletcheck", userwalletcheck);
    if (userwalletcheck.status === 204) {
      let data = {
        username: username,
        // sessionStorage.getItem("username"),
        wallet_amount: this.state.card
      };

      const insertnewWalletResponse = await axios.post(
        `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet`,
        data
      );
      console.log("insertnewWalletResponse", insertnewWalletResponse);
      this.setState({
        card: insertnewWalletResponse.data.wallet_amount
      });
    } else if (userwalletcheck.status === 200) {
      console.log("Status Code amount Wallet:", userwalletcheck.data[0].amount);
      console.log("here");
      this.setState({
        card: userwalletcheck.data[0].amount
      });
    }
  }
  enablePaymentOptions = () => {
    this.setState({ showPaymentOptions: true });
  };

  inputHandler(event) {
    console.log("event.target.value", event.target.value);

    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addMoney = async e => {
    let PORT = 3000;
    let username = localStorage.getItem('username');
    let data = {
      username,
      amount: parseInt(this.state.updatedAmount)
    };
    console.log("add money:", data);
    const addmoneyResponse = await axios.put(
      `http://${PAYMENT_HOST_ELB.Payments_Eks_Elb}:${PORT}/wallet/add`,
      data
    );

    console.log("addmoneyResponse", addmoneyResponse);
    window.alert("Card Reloaded Successfully");
    this.setState({
      card: addmoneyResponse.data.amount,
      showPaymentOptions: false
    });
  };

  render() {
    let showcardoptions = null;

    if (this.state.showPaymentOptions === true) {
      showcardoptions = (
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
              <div className="form-group">
                <input
                  onChange={e => this.inputHandler(e)}
                  type="text"
                  name="username"
                  className="form-control form-control-lg rounded-0"
                  placeholder="Name on the Card"
                />
              </div>

              <div className="form-group">
                <input
                  onChange={e => this.inputHandler(e)}
                  name="updatedAmount"
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
      );
    }

    return (
      // <React.Fragment>
      <div class="card-header">
        <Navbar />
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

          {showcardoptions}
        </div>
      </div>
      // </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  console.log("State", state);
  return {
    UserDetails: state.MenuReducer.UserDetails
  };
}
// export default CardPayment;
export default connect(
  mapStateToProps,
  null
)(CardPayment);
