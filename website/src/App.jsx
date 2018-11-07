import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Home, Signin, Signup, ProtectedCreateClass, ProtectedJoinClass, NotFound,
  ProtectedDashboardRouter, ProtectedProfileRouter,
} from './views';
import './App.css';
import { withFirebase } from './hoc';

class App extends PureComponent {
  static propTypes = {
    signoutHandler: PropTypes.func,
  }

  static defaultProps = {
    signoutHandler: console.log('No signout handler inputted'),
  }

  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  signout() {
    const { signoutHandler } = this.props;
    signoutHandler();
    return <Redirect to="/" />;
  }

  render() {
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup/:type?" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/signout" render={this.signout} />
            {/* Protected Routes */}
            <Route path="/profile" component={ProtectedProfileRouter} />
            <Route path="/create/class" component={ProtectedCreateClass} />
            <Route path="/join/class" component={ProtectedJoinClass} />
            <Route path="/dashboard/:optional?" component={ProtectedDashboardRouter} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const FirebaseApp = withFirebase(App);
export { App, FirebaseApp };
