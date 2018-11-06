import React from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { Dashboard } from '../../components';
import Profile from './Profile';
import { WithProtectedView } from '../../hoc';

const ProfileRouter = () => (
  <Router>
    <Dashboard>
      <Route exact path="/profile" component={Profile} />
    </Dashboard>
  </Router>
);

const ProtectedProfileRouter = WithProtectedView(ProfileRouter);
export { ProtectedProfileRouter, ProfileRouter };
