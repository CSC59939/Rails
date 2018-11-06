import React from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { Dashboard } from '../../components';
import { DashboardHome } from '..';
import { WithProtectedView } from '../../hoc';

const DashboardRouter = () => (
  <Router>
    <Dashboard>
      <Route exact path="/dashboard" component={DashboardHome} />
    </Dashboard>
  </Router>
);

export default WithProtectedView(DashboardRouter);
