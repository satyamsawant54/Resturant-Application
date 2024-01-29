import axios from 'axios';

import {
  MENU_CREATION_REQUEST,
  MENU_CREATION_SUCCESS,
  MENU_CREATION_FAIL,
  MENU_ITEM_UPDATE_REQUEST,
  MENU_ITEM_UPDATE_SUCCESS,
  MENU_ITEM_UPDATE_FAIL,
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

export const createMenu = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MENU_CREATION_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.post(`/api/restaurants/menus`, {}, config);

    dispatch({ type: MENU_CREATION_SUCCESS });
  } catch (error) {
    dispatch({
      type: MENU_CREATION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateMenu = ( menu) => async (dispatch, getState) => {
  try {
    dispatch({ type: MENU_ITEM_UPDATE_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.put(`/api/restaurants/menus/${menu._id}`, menu, config);

    dispatch({ type: MENU_ITEM_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: MENU_ITEM_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRestaurantMenu = () => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_MENU_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/restaurants/menus`, config);

    dispatch({ type: RESTAURANT_MENU_SUCCESS, payload: data || [] });
  } catch (error) {
    dispatch({
      type: RESTAURANT_MENU_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMenuDetails = ( menuId ) => async (dispatch) => {
  try {
    dispatch({ type: MENU_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/restaurants/menus/${menuId}`);

    dispatch({ type: MENU_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: MENU_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteMenu = ( menuId ) => async (dispatch, getState) => {
  try {
    dispatch({ type: MENU_ITEM_DELETE_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
      },
    };

    await axios.delete(`/api/restaurants/menus/${menuId}`, config);

    dispatch({ type: MENU_ITEM_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: MENU_ITEM_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
