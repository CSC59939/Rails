import React, { PureComponent } from 'react';
import { Drawer, Card } from 'antd';
import PropTypes from 'prop-types';

class Notification extends PureComponent {
  static propTypes = {
    notificationVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    onClose: () => console.log('no close function passed'),
  }

  render() {
    const notificationArray = [
      {
        title: 'Notification 1',
        message: 'Message 1',
        key: 0,
      },
      {
        title: 'Notification 2',
        message: 'Message 2',
        key: 1,
      },
    ];

    const {
      notificationVisible,
      onClose,
    } = this.props;
    return (
      <Drawer
        title="Notifications"
        placement="right"
        width="500"
        closable
        onClose={onClose}
        visible={notificationVisible}
      >
        {notificationArray.map(data => (
          <Card
            key={data.title}
            title={data.title}
            style={{ marginBottom: 25, borderRadius: 30, width: 350 }}
          >
            <p>{data.message}</p>
          </Card>
        ))}
      </Drawer>
    );
  }
}

export default Notification;
