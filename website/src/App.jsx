/* eslint-disable react/prefer-stateless-function */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-unused-expressions: 0 */

import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import { Home, Signin, Signup } from './views';
import { Dashboard } from './components';
import './App.css';
import 'firebase/auth';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      signedin: false,
    };
    this.firebaseListener = null;
    this.authStateListener = this.authStateListener.bind(this);
  }

  componentDidMount() {
    this.authStateListener();
  }

  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  authStateListener() {
    this.firebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ signedin: true });
      } else {
        this.setState({ signedin: false });
      }
    });
  }

  render() {
    const { signedin } = this.state;
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Route exact path="/" component={Home} />
          <Route path="/signup/:type?" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/dashboard/:trigger?" component={signedin ? Dashboard : <Redirect to="/" />} />
        </div>
      </Router>
    );
  }
}

export default App;
