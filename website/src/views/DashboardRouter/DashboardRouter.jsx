import React from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { Dashboard } from '../../components';
import { DashboardHome } from '..';

const DashboardRouter = () => (
  <Router>
    <Dashboard>
      <Route exact path="/dashboard" component={DashboardHome} />
    </Dashboard>
  </Router>
);

export default DashboardRouter;
