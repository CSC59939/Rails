/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, SamplePage } from './views';
import { Dashboard } from './components';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <Dashboard style={{ width: '100%', height: '100%', }}>
        <Router>
          <div style={{ height: '100%', }}>
            <Route exact path="/" component={Home} />
            <Route path="/sample" component={SamplePage} />
          </div>
          {/* Example for route
            <Route path="/...." component={ComponentName} />
          */}
        </Router>
      </Dashboard>
    );
  }
}

export default App;
