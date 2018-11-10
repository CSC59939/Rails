import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { Dashboard } from '../../components';
import { DashboardHome } from '..';
import { WithProtectedView } from '../../hoc';


class DashboardRouter extends PureComponent {
  render() {
    const {
      history,
    } = this.props;

    return (
      <Router>
        <Dashboard history={history}>
          <Route exact path="/dashboard" component={DashboardHome} />
        </Dashboard>
      </Router>);
  }
}
export default DashboardRouter;
const ProtectedDashboardRouter = WithProtectedView(DashboardRouter);
export { ProtectedDashboardRouter, DashboardRouter };
