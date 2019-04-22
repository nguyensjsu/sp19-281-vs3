import React,{ Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import './../../stylesheets/card.css';
import 'tachyons';
import {updateCart} from './../../apis/menu-api';

class Card extends Component {
  constructor(){
    super();
    this.value=Math.random()*10;
  }
  displayMenu(){
      return(
             <div className = "menu-item-div">
                <table className="table-menu">
                  <tbody>
                    <tr className = "menu-table-header-row">
                      <th  className = "menu-table-item-col">Name</th>
                      <th  className = "menu-table-item-col">Description</th>
                      <th  className = "menu-table-item-col">Calories</th>
                      <th  className = "menu-table-item-col">Price</th>
                    </tr>
                    {this.getItems(this.props.items)}
                    </tbody>
                  </table>
              </div>)
  }

  getItems(item){
      return(
        <tr className = "menu-table-item-row">
            <td className = "menu-table-item-col">{item.itemname}</td>
            <td className = "menu-table-item-col">{item.itemdescription}</td>
            <td className = "menu-table-item-col">
            {
             item.itemcaloriecontent.map((calcontent) => {
                  return(<tr><td className = "menu-table-item-col">{ calcontent.content}</td>
                         <td className = "menu-table-item-col">{calcontent.amount}</td></tr>)
               })
            }
            </td>
            <td className = "menu-table-item-col">$ {item.itemamount}</td>
            <td className = "menu-table-item-col">
            <span onClick={()=>{this.props.updateCart(item)}}
                  style={{display:"block", margin:0, padding:0, border:0,fontSize:30,color:"#0B6352",cursor:"pointer"}}>
                  &#43;
            </span>
            </td>
        </tr>
      )
  }

  render(){
    return (
        <div className="menu-home">
            {this.displayMenu()}
        </div>
    )
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
    return bindActionCreators({updateCart: updateCart}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(Card);
