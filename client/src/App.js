import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import NavBar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => {
	return (
		<Router>
			<Fragment>
				<NavBar />
				<Route exact path="/" component={Landing} />
				<section className="container">
					<Switch>
						<Route exact path="/register" component={Register} />
						<Route exact path="/Login" component={Login} />
					</Switch>
				</section>
			</Fragment>
		</Router>
	);
};

export default App;
