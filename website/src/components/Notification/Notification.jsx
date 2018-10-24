import React, { Component } from 'react';
import { Drawer, Button, Card } from 'antd';

class Notification extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const notificationArray = [
      {
        title: 'Notification 1',
        message: 'Message 1',
      },
      {
        title: 'Notification 2',
        message: 'Message 2',
      },
    ];
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          Open
        </Button>
        <Drawer
          title="Notifications"
          placement="right"
          width="500"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {notificationArray.map(data => (
            <Card title={data.title} style={{ marginBottom: 25, borderRadius: 30, width: 350 }}>
              <p>{data.message}</p>
            </Card>
          ))}
        </Drawer>
      </div>
    );
  }
}

export default Notification;
