import React,{ Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import { Route, withRouter,Redirect } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMenuItemList} from './../../apis/menu-api';
import './../../stylesheets/card.css';
import AddItem from './addItem';
import 'tachyons';

class AdminHomePage extends Component {
	constructor(){
		super();
		this.itemDetails={
			itemType:''
		}
}

	render() {
		return (
      <div className="card-container">
      <h1 className="adminheading">Starbucks Admin Page </h1>
        <div className='bg-light-orange dib br1 pa1 ma1  bw1'>
            <img className="MenuImage" alt = "home" src= "https://globalassets.starbucks.com/assets/2c9907d928474436a533e2fe4e42b8f5.jpg" />
            <h2 className="MenuDesc">Choose your espresso, love your drink</h2>
            <h5 className="MenuDesc">Enjoy all your favorites with Starbucks® smooth Blonde espresso or bold signature espresso.</h5>
         </div>
         <br></br>
         <div className = "menudetails">
         <div className='bg-light-orange dib br1 pa1 ma1  bw1'>
             <button type="button" onClick={() =>this.props.history.push('/additem')} className="btn btn-class add">Add Item</button>
             <button type="button" onClick={() =>this.props.getMenuItemList()} className="btn btn-class update">Update/Delete Item</button>
          </div>
          </div>
    </div>
			);
		}
}

function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({getMenuItemList: getMenuItemList}, dispatch);
}
export default connect(null, matchDispatchToProps)(AdminHomePage);
