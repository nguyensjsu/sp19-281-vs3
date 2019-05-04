import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { createBrowserHistory } from 'history';
import axios from "axios";
import {history} from "../../apis/menu-api.js";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


class Navbar extends Component {
  render() {
    return (
      <React.Fragment>
        <nav
          id="extended-nav"
          role="banner"
          tabindex="-1"
          style={{ height: 65, background: "#0B6352" }}
        >
        <Link to="/menu">
          <span>
            <img
              className="nav-image"
              style={{
                height: 50,
                width: 50,
                marginLeft: "-1400px",
                marginBottom: "0px",
                marginTop: "10px"
              }}
              src="http://www.ctvisit.com/sites/default/files/starbucks_2.png"
              alt="Starbucks"
            />
          </span>
        </Link>
        <Link to="/menu">
          <span className="menu-navbar">
            Menu
          </span>
        </Link>
        <Link to="/menu">
          <span className="menu-navbar1">
            Tea
          </span>
        </Link>
        <Link to="/menu">
          <span className="menu-navbar2">
            Gift Card
          </span>
        </Link>
        <Link to="/cart">
          <span className="menu-navbar3">
            Cart
          </span>
        </Link>
        <Link to="/">
        <a href ="/" onClick={() => localStorage.clear()}>
          <span className="menu-navbar4">
            Logout
          </span>
        </a>
        </Link>
        {console.log("this.props.UserDetails.adminFlag ", this.props.UserDetails.adminFlag )}
        {this.props.UserDetails.adminFlag == true ?
          <Link to="/admin">
            <span className="menu-navbar5">
              Admin
            </span>
          </Link> : ''}
        </nav>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) =>{
    return {
      MenuDetails: state.MenuReducer.MenuDetails,
      CartDetails: state.MenuReducer.CartDetails,
      UserDetails: state.MenuReducer.UserDetails
    }
}

export default connect(mapStateToProps,null)(Navbar);
