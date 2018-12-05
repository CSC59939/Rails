import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './EventSummary.css';

class EventSummary extends PureComponent {
  static propTypes = {
    course: PropTypes.string,
    eventName: PropTypes.string,
    dueDate: PropTypes.string,
    color: PropTypes.string,
  }

  static defaultProps = {
    color: 'red',
    course: '',
    eventName: '',
    dueDate: ''
  }

  render() {
    const {
      course,
      eventName,
      dueDate,
      color,
    } = this.props;
    return (
      <div style={{ borderColor: color, color }} className="EventSummary">
        <span className="course">{course}</span>
        <span className="eventName">{eventName}</span>
        <span className="dueDate">{dueDate}</span>
      </div>
    );
  }
}

export default EventSummary;
