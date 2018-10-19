import React, { Component } from 'react';
import {
  Layout, Icon, Button,
} from 'antd';
import { DashboardHeader } from '..';

import './Dashboard.css';

const { Content } = Layout;
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }

  render() {
    const {
      children,
    } = this.props;
    const {
      loggedIn,
    } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%', }}>
        {loggedIn && <DashboardHeader />}
        <Layout style={{ height: '100%', }}>
          <Content style={{ height: '100%', }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Dashboard;
