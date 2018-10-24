import React, { PureComponent } from 'react';
import { EventSummary } from '../../components';

class DashboardHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <EventSummary />
      </div>
    );
  }
}
export default DashboardHome;
