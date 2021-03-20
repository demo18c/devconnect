//takes token and send to header

import axios from 'axios';

const setAuthToken = () => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = toekn;
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
	}
};

export default setAuthToken;
