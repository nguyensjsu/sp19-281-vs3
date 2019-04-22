export const createMenu = (menudetails) => {
  console.log(menudetails);
    return {
        type: 'CREATE_MENU',
        data: menudetails
    }
};
export const getMenu = (menudetails) => {
    return {
        type: 'GET_MENU',
        data: menudetails
    }
};
export const getMenuType = (itemType) => {
    return {
        type: 'GET_MENU_TYPE',
        data: itemType
    }
};
export const updateMenu = (menudetails) => {
    return {
        type: 'UPDATE_MENU',
        data: menudetails
    }
};
export const deleteMenu = (menudetails) => {
    return {
        type: 'DELETE_MENU',
        data: menudetails
    }
};
export const addCart = (menudetails) => {
    return {
        type: 'ADD_CART',
        data: menudetails
    }
};
