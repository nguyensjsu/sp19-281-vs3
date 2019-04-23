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
    this.updatePage = this.updatePage.bind(this);
  }
  updatePage(event){
    event.preventDefault();
    this.history.push('/menu');
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
              <span className="addspan" onClick={()=>{this.props.updateCart(item)}}
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
         MenuDetails: state.MenuReducer.MenuDetails
      };
  }
function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({updateCart: updateCart,deleteMenuItem: deleteMenuItem}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps)(Card);
