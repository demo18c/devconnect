import React, { Fragment } from 'react';
import Loader from 'react-loader-spinner';

function Spinner() {
	return (
		<Fragment>
			<Loader type="Bars" height={100} width={100} timeout={3000} />
			{/* <i class="fa fa-spinner fa-spin fa-4x"></i> */}
		</Fragment>
	);
}

export default Spinner;
