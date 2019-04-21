/*
	Client REST API calls to menu microservice
*/
import {createMenu} from './../actions/index';
import {getMenu} from './../actions/index';
import {updateMenu} from './../actions/index';
import {deleteMenu} from './../actions/index';
import {getMenuType} from './../actions/index';
import {kongAPI} from '../actions/urlConstant';

// const api = kongAPI;
const api = "localhost:3001";
const headers = {
    'Accept': 'application/json'
};

export const createMenuItem = function(menudetails){
  return (dispatch) => {
    fetch(`${api}/menu/item`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(menudetails)
    }).then(res => {
        return res.json();
    }).then(result=>{
         console.log("result",result)
         dispatch(createMenu(result));
    }).catch(error => {
        console.log("This is error");
        return error;
    });
  };
};

export const getMenuItem = function(menuID) {
  return (dispatch) => {
    fetch(`${api}/menu/item/${menuID}`, {
        method: 'GET',
        headers: headers,
    }).then(res => {
      return res.json();
    }).then(result=>{
       console.log("result",result)
       dispatch(getMenu(result));
    }).catch(error => {
        console.log("getMenuItem Error !!!");
        return error;
    });
  };
};
export const getMenuItemList = function(itemType) {
  return (dispatch) => {
        fetch(`${api}/menu/items/${itemType}`, {
            method: 'GET',
            headers: headers,
        }).then(res => {
            return res.json();
        }).then(result=>{
            console.log("result",result)
            dispatch(getMenuType(result));
        }).catch(error => {
            console.log("getMenuItem list Error !!!");
            return error;
        });
    };
  };
export const updateMenuItem = function(menudetails) {
  return (dispatch) => {
    fetch(`${api}/menu/item/${menudetails}`, {
          method: 'PUT',
          headers: {
              ...headers,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(menudetails)
      }).then(res => {
          return res.json();
      }).then(result=>{
           console.log("result",result)
           dispatch(updateMenu(result));
      }).catch(error => {
           console.log("updateMenuItem Error !!!");
           return error;
      });
   };
};
export const deleteMenuItem = function(menuId) {
  return (dispatch) => {
    fetch(`${api}/menu/item/${menuId}`, {
         method: 'DELETE',
         headers: {
            ...headers,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(menuId)
     }).then(res => {
          return res.json();
     }).then(result=>{
          console.log("result",result)
          dispatch(deleteMenu(result));
     }).catch(error => {
         console.log("deleteMenuItem Error !!!");
         return error;
    });
 };
};
