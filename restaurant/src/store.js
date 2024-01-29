import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';


import {
	restaurantLoginReducer,
	restaurantRegisterReducer,
	restaurantListReducer,
	restaurantUpdateProfileReducer,
	restaurantDetailsReducer,
	restaurantUpdateReducer,
	restaurantDeleteReducer,
	restaurantCreateReviewReducer,
  } from './reducers/restaurantReducer';
  import {
	menuCreationReducer,
	menuUpdateReducer,
	restaurantMenuReducer,
	menuDetailsReducer,
	menuDeleteReducer,
  } from './reducers/menuReducer';
  

const reducer = combineReducers({
	restaurantLogin: restaurantLoginReducer,
	restaurantRegister: restaurantRegisterReducer,
	restaurantList: restaurantListReducer,
	restaurantUpdateProfile: restaurantUpdateProfileReducer,
	restaurantDetails: restaurantDetailsReducer,
	restaurantUpdate: restaurantUpdateReducer,
	restaurantDelete: restaurantDeleteReducer,
	restaurantReviewCreate: restaurantCreateReviewReducer,

	menuCreate: menuCreationReducer,
	menuUpdate: menuUpdateReducer,
	restaurantMenu: restaurantMenuReducer,
	menuDetails: menuDetailsReducer,
	menuDelete: menuDeleteReducer,
	
});

const restaurantInfoFromStorage = localStorage.getItem('restaurantInfo')
  ? JSON.parse(localStorage.getItem('restaurantInfo'))
  : null;

const initialState = {
  restaurantLogin: {
    restaurantInfo: restaurantInfoFromStorage ? restaurantInfoFromStorage : null,
  },
};


const middlewares = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
