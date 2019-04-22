import {combineReducers} from 'redux';
import MenuReducer from './menu-reducer';
const allReducers = combineReducers({
    //insert reducer name here to combine
    MenuReducer
});

export default allReducers;
