import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';


function WithProtectedView(Component) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        signedin: null,
      };
      this.authStateListener = this.authStateListener.bind(this);
      // this.signoutHandler = this.signoutHandler.bind(this);
      if (firebase.app()) this.authStateListener();
    }

    componentDidMount() {
      // if (firebase.app()) this.authStateListener();
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
      const {
        signedin,
      } = this.state;
      const {
        ...props
      } = Component;
      const {
        location,
      } = props;

      if (signedin !== null) {
        return (
          (
            <Route
              {...props}
              render={() => (
                signedin ? <Component {...props} />
                  : (
                    <Redirect to={{
                      pathname: '/signin',
                      state: { from: location },
                    }}
                    />
                  ))}
            />
          )
        );
      }
      return (
        <span>Waiting for update</span>
      );
    }
  };
}

export default WithProtectedView;
