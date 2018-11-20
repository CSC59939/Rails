import {
  Button, Card, Icon, Input, message, Modal,
} from 'antd';
import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Signin.css';

/* eslint no-undef: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-console: 0 */

export default class Signin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      /* Set pop up window to be unvisible*/
      visible: false,
    };
    this.signin = this.signin.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  signin() {
    const { email, password } = this.state;
    const { location, history } = this.props;
    if (email === '' || password === '') {
      message.error('Looks like you\'re missing something.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          if (location.state !== undefined) {
            history.push(location.state.from || '/dashboard');
          } else {
            history.push('/dashboard');
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

/* Pop out a forgot password window */
  forgotPassword = () => {
    this.setState({
      visible: true,
    });
  }

/* Handle cancel button in the forgot password window */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

/* Handle ok button in the forgot password window, send user a password reset email using firebase function */
  handleOk() {
    const { email } =  this.state;
    if (email === '') {
      message.error('Please input your email address.');
      return;
    }
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      message.success('Password reset email has been sent.')
    }).catch(function(error) {
      message.error(err.message);
    });
    this.setState({
      visible: false,
    });
}
 
  render() {
    const { email, password, loading, visible } = this.state;
    const { history } = this.props;
    const user = firebase.auth().currentUser;
    if (user) {
      history.push('/dashboard');
    }
    return (
      <div className="signin">
        <h1 className="title">Rails</h1>
        <h5 className="tag-line">Keep students on track</h5>
        <Card
          className="signin-card"
          title="Sign In"
        >
          <div>
            <Input
              required
              size="large"
              placeholder="E-Mail"
              prefix={<Icon type="mail" />}
              style={{ marginTop: 10 }}
              type="email"
              value={email}
              onChange={(e) => { this.setState({ email: e.target.value }); }}
            />
            <Input
              required
              size="large"
              placeholder="Password"
              prefix={<Icon type="ellipsis" />}
              style={{ marginTop: 10 }}
              type="password"
              value={password}
              onChange={(e) => { this.setState({ password: e.target.value }); }}
            />
            <Button icon="check-circle" size="large" block style={{ marginTop: 10 }} onClick={this.signin} loading={loading} type="primary">
              <p style={{ margin: 0, display: 'inline', marginLeft: 10 }}>Sign In</p>
            </Button>
            <Button size="large" block style={{ marginTop: 10 }} href="/signup">
              <p style={{ margin: 0, display: 'inline' }}>Don&#39;t have an account? Sign Up.</p>
            </Button>
            <Button size="large" block style={{ marginTop: 10 }} onClick={this.forgotPassword}>
              <p style={{ margin: 0, display: 'inline' }}>Forgot Password?</p>
            </Button>
            <Modal
              title="Forgot password"
              className="forgot-password-modal"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p className="forgot-password-label">Please enter your E-mail address, we will send you a password reset email:</p>
              <Input
                required
                size="large"
                placeholder="E-Mail"
                prefix={<Icon type="mail" />}
                style={{ marginTop: 10 }}
                type="email"
                value={email}
                onChange={(e) => { this.setState({ email: e.target.value }); }}
              />
            </Modal>
          </div>
        </Card>
      </div>
    );
  }
}
