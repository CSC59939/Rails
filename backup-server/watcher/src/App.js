import React, { Component } from 'react';
import { Layout, List, Menu, Input, Button, message } from 'antd';
import ReactJson from 'react-json-view'
import firebase from 'firebase/app';
import 'firebase/auth';
import Logo from './logo.svg';
import './App.css';

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      tab: '',
      email: '',
      password: '',
      sourceData: null
    };
    this.switchTab = this.switchTab.bind(this);
    this.signin = this.signin.bind(this);
  }

  componentWillUnmount() {
    firebase.auth().signOut();
  }

  switchTab(tab) {
    fetch(`http://35.196.200.81:5000/${tab.key}`,{
      method: 'POST'
    })
    .then(res => res.json())
    .then((sourceData) => {
      message.info(sourceData.message);
      if (sourceData.logs) this.setState ({ sourceData: sourceData.logs, tab: tab.key });
    }).catch((err) => {
      message.error(err.message);
      console.log(err);
    });
  }

  signin() {
    const { email, password } = this.state;
    console.log(email, password);
    if (email !== '' & password !== '') {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser
          .getIdToken(true)
          .then((idToken) => {
            fetch(`http://35.196.200.81:5000/verifyuser?idToken=${idToken}`,{
              method: 'POST',
            })
            .then(res => res.json())
            .then((result) => {
              if (result.auth === true) this.setState({ auth: true });
              else {
                message.error(result.message);
                firebase.auth().signOut();
              }
            })
            .catch((err) => {
              console.log(err);
              message.error(err.message);
            });
          })
          .catch((err) => {
            console.log(err);
            message.error(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      })
    } else {
      message.info('Missing fields');
    }
  }

  render() {
    const { auth, tab, sourceData } = this.state;
    return auth ? (
      <Layout>
      <Header>
        <div className="logo"> <img src={Logo} alt="Rails Backup Server"/> </div>
        <Menu
          theme="dark"
          mode="horizontal"
          onSelect={this.switchTab}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="logs">Logs</Menu.Item>
          <Menu.Item key="backup">Backup</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {
            tab === 'logs' ?
            <List 
              bordered
              dataSource={sourceData}
              renderItem={item => (<List.Item>{item}</List.Item>)}
            />: null
          }
          {
            tab === 'backup' ?
            <div>
              <ReactJson collapsed enableClipboard={false} src={sourceData} /> 
            </div>: null
          }
          {
            tab === '' ?
            <div>
              Choose a tab from above to view data.
            </div>
            : null
          }
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Rails Backup Server - for use by Rails Development Team only
      </Footer>
    </Layout>
    ) : (
    <div className="signin">
      <h1>Rails Backup Server</h1>
      <div className="container">
        <Input onChange={e => this.setState({ email: e.target.value })} placeholder="E-Mail" type="email"/>
        <Input onChange={e => this.setState({ password: e.target.value })} placeholder="Password" type="password"/>
        <Button onClick={this.signin} type="primary" block>Sign In</Button>
      </div>
    </div>
    );
  }
}
