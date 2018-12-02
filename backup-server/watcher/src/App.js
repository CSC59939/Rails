import React, { Component } from 'react';
import { Layout, List, Menu } from 'antd';
import Logo from './logo.svg';
import './App.css';

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: '',
      sourceData: null
    };
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(tab) {
    fetch('http://35.196.200.81:5000/'+tab.key,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => res.json())
    .then((sourceData) => {
      this.setState ({ sourceData });
    }).catch((err) => {

    });
  }

  render() {
    const { tab, sourceData } = this.state;
    return (
      <Layout className="layout">
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
            <p>backup</p> : null
          }
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Rails Backup Server - for use by Rails Development Team only
      </Footer>
    </Layout>
    );
  }
}
