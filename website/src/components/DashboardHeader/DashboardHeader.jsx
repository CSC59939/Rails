import React, { PureComponent } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends PureComponent {
  static propTypes = {
    showDrawer: PropTypes.func,
    firebase: PropTypes.shape({}),
    teacher: PropTypes.bool,
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
    teacher: false,
  }


  render() {
    const {
      showDrawer,
      firebase,
      teacher,
    } = this.props;


    const Icons = [
      {
        type: 'add_alert',
        onClick: () => console.log('add button clicked'),
        key: 'add_alert',
      },
      {
        type: 'notifications_active',
        onClick: showDrawer,
        key: 'notifications_active',
      },
      {
        type: 'settings',
        onclick: () => { window.location = '/profile'; },
        key: 'settings',
      },
    ];
    if (teacher) {
      Icons.push({
        type: 'add_circle',
        onClick: () => console.log('add button clicked'),
        key: 'add_circle',
      });
    }
    return (
      <Header className="Header">
        <ProfileInfo name={firebase.auth().currentUser ? firebase.auth().currentUser.displayName : 'User Name'} email={firebase.auth().currentUser ? firebase.auth().currentUser.email : 'email@domain.com'} />
        <HeaderIcons Icons={Icons} />
      </Header>
    );
  }
}

export default DashboardHeader;
