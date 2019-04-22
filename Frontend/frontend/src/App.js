import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import Payments from "./components/Payments/Index";
import MenuPage from "./components/Menu/menupage.js";
import ItemSearch from "./components/Menu/itemsearch.js";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Switch>
            <Route exact path="/payments" component={Payments} />
            <Route exact path="/menu" component={MenuPage} />
            <Route exact path="/menu/items" component={ItemSearch} />
          </Switch>
      </div>
    );
  }
}

export default withRouter(
  connect(null,null)(App)
);
