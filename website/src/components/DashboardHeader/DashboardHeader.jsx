import React, { Component } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends Component {
  static propTypes = {
    showDrawer: PropTypes.func,
    firebase: PropTypes.shape({}),
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
      teacher: false,
    };
  }

  componentDidMount() {
    const {
      firebase,
    } = this.props;
    console.log(firebase);
    if (firebase.auth().currentUser !== undefined) {
      firebase.auth().currentUser
        .getIdToken(true)
        .then((idToken) => {
          const { uid } = firebase.auth().currentUser;
          const reqData = { uid, idToken };
          const profileData = fetch('https://us-central1-rails-students.cloudfunctions.net/getprofile', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
          }).then((result) => {
            if (result.status === 200) {
              return result.json();
            }
            // alert(result.message);
          }).catch((err) => {
            console.log(err);
          });
          profileData.then((data) => {
            console.log(data.userData);
            this.setState({ teacher: data.userData.type === 'teacher' });
          });
        });
    }
  }

  render() {
    const {
      showDrawer,
      firebase,
      history,
    } = this.props;
    const {
      teacher,
    } = this.state;
    console.log(`teacher${teacher}`);
    console.log(history);
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
        onclick: () => (() => { window.location = '/profile'; }),
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
// export default FirebaseDashboardHeader;
// export { DashboardHeader, FirebaseDashboardHeader };
