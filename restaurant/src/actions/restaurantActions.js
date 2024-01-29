import axios from 'axios';

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
  RESTAURANT_LIST_RESET,
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
  RESTAURANT_DELETE_REQUEST,
  RESTAURANT_DELETE_SUCCESS,
  RESTAURANT_DELETE_FAIL,
  RESTAURANT_CREATE_REVIEW_REQUEST,
  RESTAURANT_CREATE_REVIEW_SUCCESS,
  RESTAURANT_CREATE_REVIEW_FAIL,
} from '../constants/restaurantConstants';

export const loginRestaurant = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: RESTAURANT_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log('Login Request Data:', { email, password });

    const { data } = await axios.post(
      `/api/restaurants/login`,
      { email, password },
      config
    );

    console.log('Login Response Data:', data);

    dispatch({ type: RESTAURANT_LOGIN_SUCCESS, payload: data });

    localStorage.setItem('restaurantInfo', JSON.stringify(data));
  } catch (error) {
    console.error('Login Error:', error);

    dispatch({
      type: RESTAURANT_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logoutRestaurant = () => (dispatch) => {
  localStorage.removeItem('restaurantInfo');
  dispatch({ type: RESTAURANT_LOGOUT });
  dispatch({ type: RESTAURANT_UPDATE_PROFILE_RESET });
  dispatch({ type: RESTAURANT_DETAILS_RESET });
  dispatch({ type: RESTAURANT_LIST_RESET });
};

export const registerRestaurant = (name, email, phone, password) => async (dispatch) => {
  try {
    dispatch({ type: RESTAURANT_REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `/api/restaurants/register`,
      { name, email, phone, password},
      config
    );

    dispatch({ type: RESTAURANT_REGISTER_SUCCESS, payload: data });
    dispatch({ type: RESTAURANT_LOGIN_SUCCESS, payload: data });

    localStorage.setItem('restaurantInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: RESTAURANT_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listRestaurants = () => async (dispatch) => {
  try {
    dispatch({ type: RESTAURANT_LIST_REQUEST });

    const { data } = await axios.get(`/api/restaurants`);

    dispatch({ type: RESTAURANT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RESTAURANT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getRestaurantDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_DETAILS_REQUEST });

    const {
			restaurantLogin: { restaurantInfo },
		} = getState(); 

		const config = {
			headers: {
				Authorization: `Bearer ${restaurantInfo.token}`,
			},
		};

    const { data } = await axios.get(`/api/restaurants/profile`, config);

    dispatch({ type: RESTAURANT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RESTAURANT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateRestaurantProfile = (restaurant) => async (dispatch, getState) => {
	try {
		dispatch({ type: RESTAURANT_UPDATE_PROFILE_REQUEST });

		const {
			restaurantLogin: { restaurantInfo },
		} = getState();

		const config = {
			headers: {
				Authorization: `Bearer ${restaurantInfo.token}`,
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.put(`/api/restaurants/profile`, restaurant, config);

		dispatch({ type: RESTAURANT_UPDATE_PROFILE_SUCCESS, payload: data });
		dispatch({ type: RESTAURANT_LOGIN_SUCCESS, payload: data });
	} catch (err) {
		dispatch({
			type: RESTAURANT_UPDATE_PROFILE_FAIL,
			payload:
				err.response && err.response.data.message
					? err.response.data.message
					: err.message,
		});
	}
};


export const updateRestaurant = (restaurant) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_UPDATE_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.put(`/api/restaurants/${restaurant._id}`, restaurant, config);

    dispatch({ type: RESTAURANT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RESTAURANT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteRestaurant = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_DELETE_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
      },
    };

    await axios.delete(`/api/restaurants/${id}`, config);

    dispatch({ type: RESTAURANT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: RESTAURANT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createRestaurantReview = (id, review) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTAURANT_CREATE_REVIEW_REQUEST });

    const {
      restaurantLogin: { restaurantInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${restaurantInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.post(`/api/restaurants/${id}/reviews`, review, config);

    dispatch({ type: RESTAURANT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    dispatch({
      type: RESTAURANT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

