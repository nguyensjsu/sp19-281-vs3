import React,{ Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import { Route, withRouter,Redirect } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Navbar from "./Navbar.jsx";
import {getMenuItemList} from './../../apis/menu-api';
import './card.css';
import 'tachyons';

class MenuPage extends Component {
	constructor(){
		super();
		this.itemDetails={
			itemType:''
		}
}

	render() {
		return (
      <div className="card-container">
			<Navbar/>
      <h1 className="menuheading-surabhi"> Starbucks Menu </h1>
        <div className='bg-light-orange dib br1 pa1 ma1  bw1'>
            <img className="MenuImage-Main-surabhi" alt = "home" src= "https://globalassets.starbucks.com/assets/2c9907d928474436a533e2fe4e42b8f5.jpg" />
            <h2 className="MenuDesc-surabhi">Choose your espresso, love your drink</h2>
            <h5 className="MenuDesc-surabhi">Enjoy all your favorites with Starbucks® smooth Blonde espresso or bold signature espresso.</h5>
         </div>
         <br></br><br></br>
         <div className = "menudetails-surabhi">
				 <table>
				 	<tr>
							<th className="ItemName-surabhi"> Drinks </th>
							<th className="ItemName-surabhi"> Food </th>
							<th className="ItemName-surabhi"> Nutrition </th>
					</tr>
					<tr>
						<td> <div className='bg-light-orange dib br1 pa1 ma1  bw1'>

	              <a href="#" onClick={() => this.props.getMenuItemList("Drink")}>
	 						 <img className="MenuDetailsImage-surabhi" alt = "home" src= "https://globalassets.starbucks.com/assets/10f88951d9ce4fd4b6eec3f0be5516d2.jpg" /></a>

	           </div> </td>
						<td><div className='bg-light-orange dib br1 ma1 bw1'>

	              <a href="#" onClick={() => this.props.getMenuItemList("Food")}><img className="MenuDetailsImage-surabhi" alt = "home" src= "https://globalassets.starbucks.com/assets/5c7c2bd2cdf240819e21a7596a37348f.jpg" /></a>

	           </div></td>
						 <td>
						 <div className='bg-light-orange dib br1 pa1 ma1  bw1'>

								 <a href="#" onClick={() => this.props.getMenuItemList("Nutrition")}><img className="MenuDetailsImage-surabhi" alt = "home" src= "https://globalassets.starbucks.com/assets/9c289f8e8367411886aab49042d12661.jpg" /></a>

							</div>
						 </td>
					</tr>
					<tr>
						<td> <h5 className="MenuDescription-surabhi">Ristretto shots of Starbucks® Blonde Espresso harmonize sweetly with steamed whole milk in the Flat White.</h5></td>
						<td> <h5 className="MenuDescription-surabhi">A worthy reason to hit the alarm and hop out of bed: our craveable, flavorful Double-Smoked Bacon, Cheddar & Egg Breakfast Sandwich.</h5></td>
						<td> <h5 className="MenuDescription-surabhi">Our Bacon & Gruyère or Egg White & Red Pepper Sous Vide Egg Bites are protein packed and bursting with flavor.</h5></td>
					</tr>
				 </table>



          </div>
    </div>
			);
		}
}

function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({getMenuItemList: getMenuItemList}, dispatch);
}
export default connect(null, matchDispatchToProps)(MenuPage);
