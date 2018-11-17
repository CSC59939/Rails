import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function WithFirebaseSimple(App) {
  return class extends PureComponent {
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
