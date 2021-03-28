// import axios from 'axios';
import { setAlert } from './alert';
import api from '../utils/api';

import { GET_PROFILE, PROFILE_ERROR } from './types';

//get current user
export const getCurrentProfile = () => async dispatch => {
	try {
		//id from token sent
		const res = await api.get('/profile/me');
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			//http status
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

//create or update profile

export const createProfile = (formData, history, edit = false) => async dispatch => {
	try {
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// };
		const res = await api.post('/profile', formData);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});

		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
		if (!edit) {
			history.push('/dashboard');
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: PROFILE_ERROR,
			//http status
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};
