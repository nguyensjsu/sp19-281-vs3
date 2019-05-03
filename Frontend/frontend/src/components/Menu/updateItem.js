import React,{ Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import { Route, withRouter,Redirect } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateMenuItem} from './../../apis/menu-api';
import './card.css';
import 'tachyons';

class UpdateItem extends Component {
	constructor(){
		super();
    this.calorie='';
    this.caloriesCo=[];
		this.itemDetails={
			ItemType:'',
      ItemName:'',
      ItemSummary:'',
      ItemDescription: '',
      ItemCalorieContent: [],
      ItemAmount: 0
		}
    this.clickHandler= this.clickHandler.bind(this);
}

clickHandler=()=> {
    var calorie = this.calorie.split(',');
    for(var i = 0 ; i < calorie.length ; i++) {
      var contentdetails = calorie[i].split(":");
      var contentdetailsObject = new Object();
      contentdetailsObject.content = contentdetails[0];
      contentdetailsObject.amount = contentdetails[1];
      this.itemDetails.ItemCalorieContent.push(contentdetailsObject);
      this.itemDetails.itemId = this.props.MenuDetails.itemid;
    }
     this.props.updateMenuItem(this.itemDetails);
}
	render() {
		return (
      <div className="card-container">
        <h3 className="updatelabel">Enter Menu Item Details</h3>
          <form>
            <label className="itemLabel">Item Name</label>
            <input className="itemInputText" type="text" id="name" name="name" defaultValue={this.props.MenuDetails.itemname!='' ? this.props.MenuDetails.itemname:''}
                onChange={(event) => { this.itemDetails.ItemName = event.target.value}}/>
            <label className="itemLabel">Item Summary</label>
            <input className="itemInputText" type="text" id="summary" name="summary" defaultValue={this.props.MenuDetails.itemsummary!='' ? this.props.MenuDetails.itemsummary:''}
                onChange={(event) => { this.itemDetails.ItemSummary= event.target.value}}/>
            <label className="itemLabel">Item Description</label>
            <input className="itemInputText" type="text" id="description" name="description" defaultValue={this.props.MenuDetails.itemdescription!='' ? this.props.MenuDetails.itemdescription:''}
                onChange={(event) => { this.itemDetails.ItemDescription= event.target.value}}/>
            <label className="itemLabel">Calorie Content</label>
            <input className="itemInputText" type="text" id="calorie" name="calorie"
                onChange={(event) => {this.calorie= event.target.value}}/>
            <label className="itemLabel">Item Amount</label>
            <input className="itemInputText" type="text" id="amount" name="amount" defaultValue={this.props.MenuDetails.itemamount!='' ? this.props.MenuDetails.itemamount:''}
                onChange={(event) => { this.itemDetails.ItemAmount= event.target.value}}/>
            <label className="itemLabel">Item Type</label>
            <input className="itemInputText" type="text" id="type" name="type" defaultValue={this.props.MenuDetails.itemtype!='' ? this.props.MenuDetails.itemtype:''}
                onChange={(event) => { this.itemDetails.ItemType= event.target.value}}/>
          </form>
          <input type="submit" className="item_button" value="Update Item" onClick={()=>this.clickHandler()} />
            <button type="button" onClick={() =>this.props.history.push('/menu')} className="item_button">Menu</button>
      </div>
			);
		}
}
function mapStateToProps(state) {
    console.log("State",state);
      return {
         MenuDetails: state.MenuReducer.MenuDetails
      };
  }

function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({updateMenuItem: updateMenuItem}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(UpdateItem);
