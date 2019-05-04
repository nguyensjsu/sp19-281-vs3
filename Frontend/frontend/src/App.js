import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import Payments from "./components/Payments/Index";
import MenuPage from "./components/Menu/menupage.js";
import ItemSearch from "./components/Menu/itemsearch.js";
import AdminHomePage from "./components/Menu/adminHomePage.js";
import AddItem from "./components/Menu/addItem.js";
import UpdateItem from "./components/Menu/updateItem.js";
import CardPay from "./components/Card/CardPayment";
import Signup from "./components/Login/Signup";
import Login from "./components/Login/Login";
import Order from "./components/Orders/Orders";
import Cart from "./components/Cart/cart";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/payments" component={Payments} />
          <Route exact path="/cardpay" component={CardPay} />
          <Route exact path="/menu" component={MenuPage} />
          <Route exact path="/menu/items" component={ItemSearch} />
          <Route exact path="/admin" component={AdminHomePage} />
          <Route exact path="/additem" component={AddItem} />
          <Route exact path="/updateitem" component={UpdateItem} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Login} />
          <Route exact path="/order" component={Order} />
          <Route exact path="/cart" component={Cart} />/
        </Switch>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    null
  )(App)
);
