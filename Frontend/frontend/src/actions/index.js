export const createMenu = (menudetails) => {
  console.log(userDetail);
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
