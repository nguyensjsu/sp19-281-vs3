import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { Route, withRouter, Redirect } from "react-router-dom";
import "./../../stylesheets/card.css";
import "tachyons";

class MenuPage extends Component {
  render() {
    return (
      <div className="card-container">
        <h1 className="menuheading"> Starbucks Menu </h1>
        <div className="bg-light-orange dib br1 pa1 ma1  bw1">
          <img
            className="MenuImage"
            alt="home"
            src="https://globalassets.starbucks.com/assets/2c9907d928474436a533e2fe4e42b8f5.jpg"
          />
          <h2 className="MenuDesc">Choose your espresso, love your drink</h2>
          <h5 className="MenuDesc">
            Enjoy all your favorites with Starbucks® smooth Blonde espresso or
            bold signature espresso.
          </h5>
        </div>
        <br />
        <div className="menudetails">
          <div className="bg-light-orange dib br1 pa1 ma1  bw1">
            <h1 className="ItemName">Drinks</h1>
            <a href="www.google.com">
              <img
                className="MenuDetailsImage"
                alt="home"
                src="https://globalassets.starbucks.com/assets/10f88951d9ce4fd4b6eec3f0be5516d2.jpg"
              />
            </a>
            <h5 className="MenuDescription">
              Ristretto shots of Starbucks® Blonde Espresso harmonize sweetly
              with steamed whole milk in the Flat White.
            </h5>
          </div>
          <div className="bg-light-orange dib br1 ma1 bw1">
            <h1 className="ItemName">Food</h1>
            <a href="www.google.com">
              <img
                className="MenuDetailsImage1"
                alt="home"
                src="https://globalassets.starbucks.com/assets/5c7c2bd2cdf240819e21a7596a37348f.jpg"
              />
            </a>
            <h5 className="MenuDescription">
              A worthy reason to hit the alarm and hop out of bed: our
              craveable, flavorful Double-Smoked Bacon, Cheddar & Egg Breakfast
              Sandwich.
            </h5>
          </div>
          <div className="bg-light-orange dib br1 pa1 ma1  bw1">
            <h1 className="ItemName">Nutrition</h1>
            <a href="www.google.com">
              <img
                className="MenuDetailsImage"
                alt="home"
                src="https://globalassets.starbucks.com/assets/9c289f8e8367411886aab49042d12661.jpg"
              />
            </a>
            <h5 className="MenuDescription">
              Our Bacon & Gruyère or Egg White & Red Pepper Sous Vide Egg Bites
              are protein packed and bursting with flavor.
            </h5>
          </div>
        </div>
      </div>
    );
  }
}
export default MenuPage;
