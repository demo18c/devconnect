//takes token and send to header

import axios from 'axios';

// const setAuthToken = token => {
// 	if (token) {
// 		axios.defaults.headers.common['x-auth-token'] = token;
// 		localStorage.setItem('token', token);
// 	} else {
// 		delete axios.defaults.headers.common['x-auth-token'];
// 		localStorage.removeItem('token');
// 	}
// };

// export default setAuthToken;

// import api from './api';

const setAuthToken = token => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('token', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('token');
	}
};

export default setAuthToken;
