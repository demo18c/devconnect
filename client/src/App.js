import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//redux
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

//components
import NavBar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
// import CreateProfile from './components/profile-form/CreateProfile';
import ProfileForm from './components/profile-form/ProfileForm';

//
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//private route
import PrivateRoute from './components/routing/PrivateRoute';

const App = () => {
	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<NavBar />
					<Route exact path="/" component={Landing} />
					<section className="container">
						<Alert />
						<Switch>
							<Route exact path="/register" component={Register} />
							<Route exact path="/Login" component={Login} />
							<PrivateRoute path="/Dashboard" component={Dashboard} />
							{/* <PrivateRoute path="/create-profile" component={CreateProfile} /> */}
							<PrivateRoute path="/create-profile" component={ProfileForm} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
