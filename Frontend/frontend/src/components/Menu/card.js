import React,{ Component } from 'react';
import { Route, withRouter,Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { createBrowserHistory } from 'history';
import './../../stylesheets/card.css';
import 'tachyons';
import {updateCart} from './../../apis/menu-api';
import {updateMenuItem} from './../../apis/menu-api';
import {deleteMenuItem} from './../../apis/menu-api';

class Card extends Component {
  constructor(){
    super();
    this.CartItems={
			_id:'',
      username:'',
      totalitems: 0,
      totalamount: 0,
      drinks: []
		}
    this.updatePage = this.updatePage.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  updatePage(event){
    event.preventDefault();
    this.history.push('/menu');
  }
  clickHandler=(item)=> {
    this.CartItems.drinks = this.props.CartDetails == null ? [] : this.props.CartDetails.drinks
    console.log("Value of item is : ", item);
    var totalquantity = 0;
    var totalprice = 0;
       this.CartItems._id = item.itemid;
       this.CartItems.username="sojan";
       var quantity= this.props.CartDetails== null ? this.CartItems.totalitems : parseInt(this.props.CartDetails.totalitems);
       this.CartItems.totalitems= quantity + 1;
       console.log("Quantity:", quantity);
        if(this.props.CartDetails != null) {
         console.log("In the if condition", this.CartItems.totalitems);
         for(var i = 0 ; i < quantity ; i++) {
           console.log("For loop: ", item.itemid)
           // var totalquantity = parseInt(this.props.CartDetails.drinks[i].drink_quantity);
           if(item.itemname == this.props.CartDetails.drinks[i].drink_name) {
              console.log("Same Item added: ", this.props.CartDetails.drinks[i])
              this.props.CartDetails.drinks[i].drink_quantity = this.props.CartDetails.drinks[i].drink_quantity+1;
              this.props.CartDetails.drinks[i].drink_name= item.itemname;
              this.props.CartDetails.drinks[i].drink_rate= item.itemamount;
              totalquantity = parseInt(this.props.CartDetails.drinks[i].drink_quantity);
              totalprice = parseFloat(this.props.CartDetails.drinks[i].drink_rate);
              this.CartItems.totalamount = this.props.CartDetails.totalamount + (totalquantity * totalprice);
              console.log("this.CartItems.totalamount", this.CartItems.totalamount);
              break;
           }
           else {
             console.log("inner else: ", item.itemname)
             var cartObject = new Object();
             this.CartItems.totalamount = item.itemamount;
             cartObject.drink_name = item.itemname;
             cartObject.drink_rate = item.itemamount;
             cartObject.drink_quantity = 1;
             console.log("Inner else: ", parseFloat(item.itemamount));
             this.CartItems.totalamount = this.props.CartDetails.totalamount + (1 * parseFloat(item.itemamount));

             this.props.CartDetails.drinks.push(cartObject);
           }

           //this.props.CartDetails.drink_rate = this.props.CartDetails.drinks[itemid].drink_quantity
         }
         this.props.updateCart(this.CartItems);
       }
       else {
              console.log("outer else: ", item.itemname)
               var cartObject = new Object();
               cartObject.drink_name = item.itemname;
               cartObject.drink_rate = item.itemamount;
               cartObject.drink_quantity = 1;
               this.CartItems.drinks.push(cartObject);
               // this.CartItems.drinks.concat(cartObject);
               this.CartItems.totalamount = item.itemamount;
               this.props.updateCart(this.CartItems);
       }
  }

  getItems(item){
      return(
        <tr className = "menu-table-item-row">
            <td className = "menu-table-item-col">{item.itemname}</td>
            <td className = "menu-table-item-col">{item.itemdescription}</td>
            <td className = "menu-table-item-col">
            {
             item.itemcaloriecontent.map((calcontent) => {
                  return(<tr><td className = "calorie">{ calcontent.content}</td>
                         <td className = "calorie1">{calcontent.amount}</td></tr>)
               })
            }
            </td>
            <td className = "price">{item.itemamount}</td>
            <td className = "menu-table-item-col">
            {
              <span className="addspan" onClick={()=>{this.clickHandler(item)}}
                    style={{display:"inline", border:0,fontSize:30,color:"#0B6352",cursor:"pointer"}}>
                    &#43;
              </span>
            }
            </td>
        </tr>
      )
  }

  render(){
    return (
        <div className="menu-home">
            {this.getItems(this.props.items)}
        </div>
    )
  }
}

function mapStateToProps(state) {
    console.log("State",state);
      return {
         MenuDetails: state.MenuReducer.MenuDetails,
         CartDetails: state.MenuReducer.CartDetails
      };
  }
function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({updateCart: updateCart,deleteMenuItem: deleteMenuItem}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(Card);
