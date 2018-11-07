import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function WithFirebaseSimple(App) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.firebaseListener = null;
      this.authStateListener = this.authStateListener.bind(this);
      if (firebase.app()) this.authStateListener();
    }

    componentWillUnmount() {
      if (this.firebaseListener) {
        this.firebaseListener();
      }
      this.authStateListener = undefined;
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
      return (
        <App
          {...this.props}
          firebase={firebase}
        />
      );
    }
  };
}

export default WithFirebaseSimple;
