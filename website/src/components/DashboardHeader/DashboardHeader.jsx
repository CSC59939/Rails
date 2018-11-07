import React, { Component } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import { WithFirebaseSimple } from '../../hoc';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends Component {
  static propTypes = {
    showDrawer: PropTypes.func,
    firebase: PropTypes.object,
  }

  static defaultProps = {
    showDrawer: () => console.log('Never passed showDrawer'),
    firebase: {
      auth() {
        return {
          currentUser: undefined,
        };
      },
    },
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      showDrawer,
      firebase,
    } = this.props;
    const Icons = [
      {
        type: 'add_circle',
        onClick: () => console.log('add button clicked'),
      },
      {
        type: 'add_alert',
        onClick: () => console.log('add button clicked'),
      },
      {
        type: 'notifications_active',
        onClick: () => console.log('add button clicked'),
      },
    ];
    return (
      <Header className="Header">
        <ProfileInfo name={firebase.auth().currentUser ? firebase.auth().currentUser.displayName : 'User Name'} email={firebase.auth().currentUser ? firebase.auth().currentUser.email : 'email@domain.com'} />
        <HeaderIcons Icons={Icons} howDrawer={showDrawer} />
      </Header>
    );
  }
}

const FirebaseDashboardHeader = WithFirebaseSimple(DashboardHeader);
export default { DashboardHeader, FirebaseDashboardHeader };
// export default FirebaseDashboardHeader;
// export { DashboardHeader, FirebaseDashboardHeader };
