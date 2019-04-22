<<<<<<< HEAD
import {combineReducers} from 'redux';
import MenuReducer from './menu-reducer';
const allReducers = combineReducers({
    //insert reducer name here to combine
    MenuReducer
=======
import { combineReducers } from "redux";
import menu from "./menu-reducer";
const allReducers = combineReducers({
  //insert reducer name here to combine
  menu: menu
>>>>>>> ad5c196ce238c882f73591de76bfd31e7fd49632
});

export default allReducers;
