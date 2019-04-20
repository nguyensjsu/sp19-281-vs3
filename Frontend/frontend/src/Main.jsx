import React, { Component } from "react";
import { Route } from "react-router-dom";
import Payments from "./components/Payments/Index";
import MenuPage from "./components/Menu/menupage.js";

class Main extends Component {
  render() {
    return (
      <div>
        <Route exact path="/payments" component={Payments} />
        <Route exact path="/menu" component={MenuPage} />
      </div>
    );
  }
}
export default Main;
