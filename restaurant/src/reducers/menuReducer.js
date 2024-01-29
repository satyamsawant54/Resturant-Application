import {    
    MENU_CREATION_REQUEST,
    MENU_CREATION_SUCCESS,
    MENU_CREATION_FAIL,
    MENU_CREATION_RESET,
    MENU_ITEM_UPDATE_REQUEST,
    MENU_ITEM_UPDATE_SUCCESS,
    MENU_ITEM_UPDATE_FAIL,
    MENU_ITEM_UPDATE_RESET,
    RESTAURANT_MENU_REQUEST,
    RESTAURANT_MENU_SUCCESS,
    RESTAURANT_MENU_FAIL,
    MENU_DETAILS_REQUEST,
    MENU_DETAILS_SUCCESS,
    MENU_DETAILS_FAIL,
    MENU_ITEM_DELETE_REQUEST,
    MENU_ITEM_DELETE_SUCCESS,
    MENU_ITEM_DELETE_FAIL,
  } from '../constants/menuConstants';  
  
   
  export const menuCreationReducer = (state = {}, action) => {
    switch (action.type) {
      case MENU_CREATION_REQUEST:
        return { loading: true };
      case MENU_CREATION_SUCCESS:
        return { loading: false, success: true, menu: action.payload };
      case MENU_CREATION_FAIL:
        return { loading: false, error: action.payload };
      case MENU_CREATION_RESET:
        return {};
      default:
        return state;
    }
  };

  export const menuUpdateReducer = (state = { menu: {} }, action) => {
    switch (action.type) {
      case MENU_ITEM_UPDATE_REQUEST:
        return { loading: true };
      case MENU_ITEM_UPDATE_SUCCESS:
        return { loading: false, success: true, menu: action.payload };
      case MENU_ITEM_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case MENU_ITEM_UPDATE_RESET:
        return { menu: {} };
      default:
        return state;
    }
  };
  
  export const restaurantMenuReducer = (state = { menus: [] }, action) => {
    switch (action.type) {
      case RESTAURANT_MENU_REQUEST:
        return { loading: true, menus: [] };
      case RESTAURANT_MENU_SUCCESS:
        return { loading: false, menus: action.payload };
      case RESTAURANT_MENU_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const menuDetailsReducer = (state = { menu: {} }, action) => {
    switch (action.type) {
      case MENU_DETAILS_REQUEST:
        return { ...state, loading: true };
      case MENU_DETAILS_SUCCESS:
        return { loading: false, menu: action.payload };
      case MENU_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const menuDeleteReducer = (state = { success: false }, action) => {
    switch (action.type) {
      case MENU_ITEM_DELETE_REQUEST:
        return { ...state, loading: true };
      case MENU_ITEM_DELETE_SUCCESS:
        return { ...state, loading: false, success: true };
      case MENU_ITEM_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  