import React, { PureComponent } from 'react';
import {
  Button, Icon, Input, Form, message, Card, InputNumber, Collapse,
} from 'antd';
import './Profile.css';
import firebase from 'firebase/app';
import 'firebase/auth';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gotUserProfile: false,
      userData: null,
    };
  }

  componentDidMount() {
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
          message.error(result.message);
        }).catch((err) => {
          console.log(err);
        });
        profileData.then((data) => {
          message.success(data.message);
          console.log(data.userData);
          this.setState({ userData: data.userData, gotUserProfile: true });
        });
      });
  }

  render() {
    const { userData, gotUserProfile } = this.state;
    return (
      <div className="profile-page">
        {
        gotUserProfile
          ? (
            <div className="profile-page">

              <Card
                className="profile-card"
                title="About You"
              >
                <Input placeholder="Full Name" value={userData ? userData.displayName : ''} />
                <Input placeholder="E-Mail" value={userData ? userData.email : ''} />
                <Input placeholder="Old Password" id="oldPasswordInput" />
                <Input placeholder="New Password" id="oldPasswordInput" />
                <Button type="primary" block>Change Password</Button>
              </Card>
              <Card
                className="profile-card"
                title="Your Academics"
              >
                {
            userData.type === 'student'
              ? <Button href="/join/class" type="primary" block>Join Class</Button>
              : <Button href="/create/class" type="primary" block>Create Class</Button>
          }
                {
              userData.universities === {}
                ? (
                  <p>You haven't joined any universities/classes yet.</p>

                )
                : (
                  <Collapse>
                    {
                    Object.keys(userData.universities).map(university => (
                      <Collapse.Panel header={university}>
                        {
                            Object.keys(userData.universities[university]).map(classUid => (
                              <Card
                                title={userData.university[university][classUid].name}
                              >
                                <p>{userData.universities[university][classUid].description}</p>
                              </Card>
                            ))
                          }
                      </Collapse.Panel>
                    ))
                  }
                  </Collapse>
                )
            }
              </Card>
            </div>
          )
          : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
            >
              <Icon className="protected-view-loading" type="loading" theme="outlined" />
            </div>
          )
      }
      </div>
    );
  }
}

export default Profile;
