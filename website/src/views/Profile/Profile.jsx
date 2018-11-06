import React from 'react';
import { Button, Icon, Input, Form, message} from 'antd';
import './Profile.css';
import firebase from 'firebase/app';
import 'firebase/auth';
 class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      oldPassword: '',
      newPassword: '',
    };
    this.changePassword = this.changePassword.bind(this);
  }
  changePassword() {
    const {userName,userEmail,oldPassword,newPassword} = this.state;
    if (!userName || !userEmail || !oldPassword || !newPassword) {
      message.error('Looks like you\'re missing something.');
      return;
    }
    if (userName === '' || userEmail === '' || oldPassword === '' || newPassword === '') {
      message.error('Looks like you\'re missing something.');
      return;
    }
    else {
      let user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
                         userEmail,
                         oldPassword
                         );
      user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
          user.updatePassword(newPassword).then(() => {
            alert('updated');
          }, (error) => {
            alert('Please, Re Signin');
          })
      },(error) => {
        message.error('incorrect email or password, please re-signin')
      })
    }
  }
  render() {
    return (
    <div className="Profile">
      <div className="Body">
        <div>
          <p className="AboutYou">About You</p>
          <p className="YourAcademic">Your Academic</p>
        </div>
        <Form className="Body_AboutYou">
          <Input
            style={{ width: '70%' }}
            placeholder="User Name"
            className="AboutYou_input input_UserName"
            onChange={(e) => this.setState({userName:e.target.value})}
            />
          <Input
            type="email"
            style={{ width: '70%' }}
            placeholder="User Email(Not EDITABLE)"
            className="AboutYou_input input_UserEmail"
            onChange={(e) => this.setState({userEmail:e.target.value})}
            />
          <Input
            type= "password"
            style={{ width: '70%' }}
            placeholder="Old Password(EMPTY INITIALLY)"
            className="AboutYou_input input_OldPassword"
            onChange={(e) => this.setState({oldPassword:e.target.value})}
            />
          <Input
            type= "password"
            style={{ width: '70%' }}
            placeholder="New Password(EMPTY INITIALLY)"
            className="AboutYou_input input_NewPassword"
            onChange={(e) => this.setState({newPassword:e.target.value})}
            />
          <Button className="Button_ChangePassword" style={{ color: '#87ceeb' }} onClick={this.changePassword}>Change Password</Button>
        </Form>
        <div className="Body_YourAcademics">
          <div className="Body_University">
            <h3 className="UniversityName">University 1</h3>
              <ul>
                <li>ClassA <Icon className="IconSelect" type="select" /></li>
                <li>ClassB <Icon className="IconSelect" type="select" /></li>
              </ul>
          </div>
          <div className="Body_University">
          </div>
          <Button className="Button_JoinAnotherClass" style={{ color: '#87ceeb' }}>Join Another Class</Button>
          <Button className="Button_JoinAnotherUniversity" type="primary" style={{ color: 'white' }}>Join Another University </Button>
        </div>
      </div>
    </div>
  )
  }
}
export default Profile;
