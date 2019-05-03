import React,{ Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import { Route, withRouter,Redirect,Link } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {deleteMenuItem} from './../../apis/menu-api';
import './card.css';
import AddItem from './updateItem';
import UpdateItem from './addItem';
import {getMenuItem} from './../../apis/menu-api';
import 'tachyons';

class AdminHomePage extends Component {
	constructor(){
		super();
		this.itemId='';
		this.clickHandler = this.clickHandler.bind(this);
}
clickHandler=()=> {
     this.props.getMenuItemList("Drink");
		 this.props.history.push('/menu/items');
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
				  <table>
						<tbody>
						<tr>
						 <label className="adminlabel">Enter Item Id</label>
						 </tr>
						 <tr>
							 <input className="itemInputText" type="text" id="amount" name="amount"
							 onChange={(event) => { this.itemId= event.target.value}}/>
							 <Link to = '/updateitem'><button type="button" onClick={() =>this.props.getMenuItem(this.itemId)} className="btn btn-class update">Update Item</button></Link>
	             <button type="button" onClick={()=>this.props.deleteMenuItem(this.itemId)} className="btn btn-class delete">Delete Item</button>
						 </tr>
						 <tr>
						 		<button type="button" onClick={() =>this.props.history.push('/additem')} className="btn btn-class add">Add Item</button>
						 </tr>
						 </tbody>
					</table>
					</div>
          </div>
    </div>
			);
		}
}

function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({getMenuItem: getMenuItem, deleteMenuItem: deleteMenuItem}, dispatch);
}
export default connect(null, matchDispatchToProps)(AdminHomePage);
