import React, { Component } from "react";
import { Route } from "react-router-dom";
import Payments from "./components/Payments/Index";

class Main extends Component {
  render() {
    return (
      <div>
        <Route exact path="/payments" component={Payments} />)
      </div>
    );
  }
}
export default Main;
