import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "./EventSummary.css";

class EventSummary extends PureComponent {
  static propTypes = {
    event: PropTypes.object.shape({
      color: PropTypes.string,
      course: PropTypes.string,
      eventName: PropTypes.string,
      dueDate: PropTypes.string
    })
  };

  static defaultProps = {
    event: {
      color: "red",
      course: "",
      eventName: "",
      dueDate: ""
    }
  };

  render() {
    const { event } = this.props;
    const time = moment(event.dueDate).format("hh:mm A");
    return (
      <div
        style={{ backgroundColor: this.priorityColor() }}
        onClick={() => {
          event.viewEvent(event);
        }}
        className="EventSummary"
      >
        <span className="course">{event.course}</span>
        <span className="eventName">{event.title}</span>
        <span className="dueDate">{time}</span>
      </div>
    );
  }
}

export default EventSummary;
