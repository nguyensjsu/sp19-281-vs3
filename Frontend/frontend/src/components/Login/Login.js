import React,{ Component } from 'react';
import { Route, Redirect,withRouter,Link } from 'react-router-dom';
import './login.css';
import Navbar from "./../Menu/Navbar.jsx";
import { Button,Modal,Checkbox } from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {userLogin} from './../../apis/menu-api';
import {history} from "../../apis/menu-api.js";

class Login extends Component {
	constructor(props) {
		super(props);
		this.userDetails = {
			username: "",
			password: "",
		};
		this.clickHandler = this.clickHandler.bind(this);
	}
	clickHandler=()=> {
	     this.props.userLogin(this.userDetails);
	}
	componentWillReceiveProps(nextProps){
		console.log("nextProps.error",nextProps.UserDetails.error);
  if(nextProps.UserDetails.error !== "UserName doesnot exist"){
		this.props.history.push('/menu')
  }
	else {
		this.props.history.push('/')
	}
}

	render() {
		return(
			<div className="signup-container">
				  <img className="signupimage" alt = "home" src= "http://www.ctvisit.com/sites/default/files/starbucks_2.png" />
						<form className="form-group2">
    						<table className="login-table">
                  <tr className="first-line">Create an Account</tr>
                  <br></br>
                    <tr><label className="itemLabel"> First Name </label><br></br></tr>
    						      <tr>
    						      		<td><input type="text" className="itemInputText" required
                          onChange={(userinput) => {
                              this.userDetails.username=userinput.target.value}}/>
                          </td>
    						      </tr>
                      <tr><label className="itemLabel"> Password </label><br></br></tr>
    						      <tr > <td><input type="password" required className="itemInputText"
                      onChange={(userinput) => {
                          this.userDetails.password=userinput.target.value}}/>
                      </td></tr>
										<button type="button" onClick={(e) =>this.clickHandler()}
											 className="btn btn-primary join">Login</button>
											 <button type="button" onClick={(e) =>this.props.history.push('/signup')}
 											 className="btn btn-primary join">Sign Up</button>
    							</table>
						   </form>
			</div>
			);
	}
}
function mapStateToProps(state) {
    console.log("State",state);
      return {
         UserDetails: state.MenuReducer.UserDetails
      };
  }
function matchDispatchToProps(dispatch){
    console.log("Dispatch",dispatch);
    return bindActionCreators({userLogin: userLogin}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Login);
