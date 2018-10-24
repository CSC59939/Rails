import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './EventSummary.css';

class EventSummary extends PureComponent {
  static propTypes = {
    classs: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
  }

  render() {
    const {
      classs,
      eventName,
      dueDate,
    } = this.props;
    return (
      <div>
        <span className="classStyle">{classs}</span>
        <span className="eventName">{eventName}</span>
        <span className="dueDate">{dueDate}</span>
      </div>
    );
  }
}

export default EventSummary;
