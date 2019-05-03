const initialState = {
        MenuDetails:{},
        CartDetails:null,
        UserDetails: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
            case 'CREATE_MENU':
              console.log("Create Menu", action.data);
              return Object.assign({}, state, {
              MenuDetails : action.data
            })
            case 'GET_MENU':
              console.log("Get Menu", action.data);
              return Object.assign({}, state, {
              MenuDetails : action.data
            })
            case 'GET_MENU_TYPE':
              console.log("Get Menu item of type", action.data);
              return Object.assign({}, state, {
              MenuDetails : action.data
            })
            case 'UPDATE_MENU':
              console.log("Update Menu", action.data);
              return Object.assign({}, state, {
              MenuDetails : action.data
            })
            case 'DELETE_MENU':
              console.log("Delete Menu", action.data);
              return Object.assign({}, state, {
              MenuDetails : action.data
            })
            case 'ADD_CART':
              console.log("Add item to cart", action.data);
              return Object.assign({}, state, {
              CartDetails : action.data
            })
            case 'ADD_USER':
              console.log("Add user", action.data);
              return Object.assign({}, state, {
              UserDetails : action.data
            })
            case 'LOGIN_USER':
              console.log("Login user", action.data);
              return Object.assign({}, state, {
              UserDetails : action.data
            })
          default:
            return state;
  }
}
