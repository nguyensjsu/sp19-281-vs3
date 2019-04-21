import {combineReducers} from 'redux';
import menu from './menu-reducer';
const allReducers = combineReducers({
    //insert reducer name here to combine
    menu:menu
});

export default allReducers;
