import {
    RESTAURANT_LOGIN_REQUEST,
    RESTAURANT_LOGIN_SUCCESS,
    RESTAURANT_LOGIN_FAIL,
    RESTAURANT_LOGOUT,
    RESTAURANT_REGISTER_REQUEST,
    RESTAURANT_REGISTER_SUCCESS,
    RESTAURANT_REGISTER_FAIL,
    RESTAURANT_LIST_REQUEST,
    RESTAURANT_LIST_SUCCESS,
    RESTAURANT_LIST_FAIL,
    RESTAURANT_UPDATE_PROFILE_FAIL,
    RESTAURANT_UPDATE_PROFILE_REQUEST,
    RESTAURANT_UPDATE_PROFILE_RESET,
    RESTAURANT_UPDATE_PROFILE_SUCCESS,
    RESTAURANT_DETAILS_REQUEST,
    RESTAURANT_DETAILS_SUCCESS,
    RESTAURANT_DETAILS_FAIL,
    RESTAURANT_DETAILS_RESET,
    RESTAURANT_UPDATE_REQUEST,
    RESTAURANT_UPDATE_SUCCESS,
    RESTAURANT_UPDATE_FAIL,
    RESTAURANT_UPDATE_RESET,
    RESTAURANT_DELETE_REQUEST,
    RESTAURANT_DELETE_SUCCESS,
    RESTAURANT_DELETE_FAIL,
    RESTAURANT_CREATE_REVIEW_REQUEST,
    RESTAURANT_CREATE_REVIEW_SUCCESS,
    RESTAURANT_CREATE_REVIEW_FAIL,
    RESTAURANT_CREATE_REVIEW_RESET,
    } from '../constants/restaurantConstants';
  
  export const restaurantLoginReducer = (state = {}, action) => {
    switch (action.type) {
      case RESTAURANT_LOGIN_REQUEST:
        return { loading: true };
      case RESTAURANT_LOGIN_SUCCESS:
        const { _id, ...restaurantInfoWithoutId } = action.payload;
        return { loading: false, restaurantInfo: restaurantInfoWithoutId, restaurantId: _id };
      case RESTAURANT_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case RESTAURANT_LOGOUT:
        return {};
      default:
        return state;
    }
  };
  
  
  export const restaurantRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case RESTAURANT_REGISTER_REQUEST:
        return { loading: true };
      case RESTAURANT_REGISTER_SUCCESS:
        return { loading: false, restaurantInfo: action.payload };
      case RESTAURANT_REGISTER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const restaurantUpdateProfileReducer = (state = { restaurant: {} }, action) => {
    switch (action.type) {
      case RESTAURANT_UPDATE_PROFILE_REQUEST:
        return { ...state, loading: true };
      case RESTAURANT_UPDATE_PROFILE_SUCCESS:
        return { loading: false, restaurant: action.payload, success: true };
      case RESTAURANT_UPDATE_PROFILE_FAIL:
        return { loading: false, error: action.payload };
      case RESTAURANT_UPDATE_PROFILE_RESET:
        return { restaurant: {} };
      default:
        return state;
    }
  };
  
  export const restaurantListReducer = (state = { restaurants: [] }, action) => {
    switch (action.type) {
      case RESTAURANT_LIST_REQUEST:
        return { loading: true };
      case RESTAURANT_LIST_SUCCESS:
        return { loading: false, restaurantList: action.payload };
      case RESTAURANT_LIST_FAIL:
        return { loading: false, error: action.payload };        
      default:
        return state;
    }
  };
  
  export const restaurantDetailsReducer = (state = { restaurant: {} }, action) => {
    switch (action.type) {
      case RESTAURANT_DETAILS_REQUEST:
        return { ...state, loading: true };
      case RESTAURANT_DETAILS_SUCCESS:
        return { loading: false, restaurant: action.payload };
      case RESTAURANT_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      case RESTAURANT_DETAILS_RESET:
        return { restaurant: {} };
      default:
        return state;
    }
  };
  
  export const restaurantUpdateReducer = (state = { restaurant: {} }, action) => {
    switch (action.type) {
      case RESTAURANT_UPDATE_REQUEST:
        return { ...state, loading: true };
      case RESTAURANT_UPDATE_SUCCESS:
        return { loading: false, success: true, restaurant: action.payload };
      case RESTAURANT_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case RESTAURANT_UPDATE_RESET:
        return { restaurant: {} };
      default:
        return state;
    }
  };
  
  export const restaurantDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case RESTAURANT_DELETE_REQUEST:
        return { loading: true };
      case RESTAURANT_DELETE_SUCCESS:
        return { loading: false, success: true };
      case RESTAURANT_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const restaurantCreateReviewReducer = (state = { restaurant: {} }, action) => {
    switch (action.type) {
      case RESTAURANT_CREATE_REVIEW_REQUEST:
        return { ...state, loading: true };
      case RESTAURANT_CREATE_REVIEW_SUCCESS:
        return { ...state, loading: false, success: true };
      case RESTAURANT_CREATE_REVIEW_FAIL:
        return { ...state, loading: false, error: action.payload };
      case RESTAURANT_CREATE_REVIEW_RESET:
        return  { restaurant: {} };
      default:
        return state;
    }
  };
   
 