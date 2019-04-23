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
    this.ownerFlag= false;
    this.updatePage = this.updatePage.bind(this);
  }
  updatePage(event){
    event.preventDefault();
    this.history.push('/menu');
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
            {
              this.ownerFlag == true ? <span style={{display:"block", margin:0, padding:10, border:0,fontSize:30,color:"#0B6352",cursor:"pointer"}}>
              <span onClick={() =>this.props.deleteMenuItem(item.itemid)} className="deletespan">&#215;</span>
                <Link
                  to={{ pathname: "/menu", state: "" }}
                  className="updatespan"
                ><span>&#8513;</span>
                </Link>

              </span> : <span onClick={()=>{this.props.updateCart(item)}}
                    style={{display:"block", margin:0, padding:0, border:0,fontSize:30,color:"#0B6352",cursor:"pointer"}}>
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
    return bindActionCreators({updateCart: updateCart,updateMenuItem: updateMenuItem, deleteMenuItem: deleteMenuItem}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(Card);
