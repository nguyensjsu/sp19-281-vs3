/*
	Client REST API calls to menu microservice
*/
import { createBrowserHistory } from "history";
import { createMenu } from "./../actions/index";
import { getMenu } from "./../actions/index";
import { updateMenu } from "./../actions/index";
import { deleteMenu } from "./../actions/index";
import { getMenuType } from "./../actions/index";
import { addCart } from "./../actions/index";
import { userSignupAction } from "./../actions/index";
import { userLoginAction } from "./../actions/index";
import { kongAPI } from "../actions/urlConstant";
import {
  Payments_ELB,
  Cart_ELB,
  Login_ELB,
  Menu_ELB
} from "./../Helpers/helper.js";

// const api = kongAPI;
const api = "http://localhost:3001";
const headers = {
  Accept: "application/json"
};
export const history = createBrowserHistory();
export const createMenuItem = function(menudetails) {
  console.log("Payload sent to backend", menudetails);
  return dispatch => {
    fetch(`http://${Menu_ELB}:8080/menu/item`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menudetails)
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(createMenu(result));
        alert("Item Successfully Added in the Menu");
        history.push("/menu");
      })
      .catch(error => {
        console.log("This is error");
        return error;
      });
  };
};

export const getMenuItem = function(menuID) {
  return dispatch => {
    fetch(`http://${Menu_ELB}:8080/menu/item/${menuID}`, {
      method: "GET",
      headers: headers
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(getMenu(result));
      })
      .catch(error => {
        console.log("getMenuItem Error !!!");
        return error;
      });
  };
};
export const getMenuItemList = function(itemType) {
  console.log("Payload sent to backend", itemType);
  return dispatch => {
    fetch(`http://${Menu_ELB}:8080/menu/items/${itemType}`, {
      method: "GET",
      headers: headers
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(getMenuType(result));
        history.push("/menu/items");
      })
      .catch(error => {
        console.log("getMenuItem list Error !!!");
        return error;
      });
  };
};
export const updateMenuItem = function(menudetails) {
  console.log("menuId in update API", menudetails);
  return dispatch => {
    fetch(`http://${Menu_ELB}:8080/menu/item/${menudetails.itemId}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menudetails)
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(updateMenu(result));
        history.push("/menu");
      })
      .catch(error => {
        console.log("updateMenuItem Error !!!");
        return error;
      });
  };
};
export const deleteMenuItem = function(menuId) {
  console.log("menuId in delete API", menuId);
  return dispatch => {
    fetch(`http://${Menu_ELB}:8080/menu/item/${menuId}`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuId)
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(deleteMenu(result));
        alert("Item Deleted Successfully.!!");
        history.push("/menu");
      })
      .catch(error => {
        console.log("deleteMenuItem Error !!!");
        return error;
      });
  };
};
export const updateCart = function(cartdetails) {
  console.log("cart details in update cart API", cartdetails);
  return dispatch => {
    fetch(`http://cart-elb-662553320.us-east-1.elb.amazonaws.com/cart/add`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cartdetails)
    })
      .then(res => {
        return res.json();
      })
      .then(result => {
        console.log("result", result);
        dispatch(addCart(cartdetails));
        // history.push('/menu')
      })
      .catch(error => {
        console.log("add cart Error !!!");
        return error;
      });
  };
};

export const userSignUp = function(userdetails) {
  console.log("user details in signupAPI", userdetails);
  return dispatch => {
    fetch(`http://${Login_ELB}:8000/signup`, {
          method: 'POST',
          headers: {
              ...headers,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userdetails)
      }).then(res => {
          return res.json();
      }).then(result=>{
           console.log("result from signup API",result)
           if(result.error != undefined && result.error.includes("E11000 duplicate key error collection")) {
             console.log("User Signup failed , duplicate entry !!!");
             alert("User Signup failed , duplicate entry")
             history.push('/');
           }
           else {
             if(localStorage.getItem('username')==null) {
                      localStorage.setItem('username',(result.username));
                  }
             dispatch(userSignupAction(result));
           }

      }).catch(error => {
           console.log("user signup Error !!!");
           return error;
      });
  };
};

export const userLogin = function(userdetails) {
  console.log("user details in login API", userdetails)
  return (dispatch) => {
    fetch(`http://${Login_ELB}:8000/login`, {
          method: 'POST',
          headers: {
              ...headers,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userdetails)
      }).then(res => {
          return res.json();
      }).then(result=>{
           console.log("result from login API",result)
           if(result.error == "UserName doesnot exist") {
             alert("User login failed , wrong entry")
             history.push('/');
           }
           else {
             if(localStorage.getItem('username')==null) {
                      localStorage.setItem('username',(result.username));
                  }
                  dispatch(userLoginAction(result));
           }
      }).catch(error => {
           console.log("user login Error !!!");
           alert("User login failed , wrong entry")
           return error;
      });
  };
};
