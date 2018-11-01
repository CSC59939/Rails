import React, { Component, Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Delayed } from '..';
import PropTypes from 'prop-types';

// const ProtectedRoute = ({ isAllowed, ...props }) => (isAllowed
//   ? <Route {...props} />
//   : <Redirect to="/signin" />);

class ProtectedRoute extends Component {
  static propTypes = {
    isAllowed: PropTypes.bool,
  }

  static defaultProps = {
    isAllowed: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      hasRecievedUpdatedProps: false,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isAllowed,
    } = this.props;
    if (isAllowed !== prevProps.isAllowed) {
      this.setState({ hasRecievedUpdatedProps: true });
    }
  }

  render() {
    const {
      isAllowed,
      ...props
    } = this.props;
    const {
      hasRecievedUpdatedProps,
    } = this.state;

    if (hasRecievedUpdatedProps) {
      return (
        <Fragment>
          {isAllowed
            ? <Route {...props} />
            : <Redirect to="/signin" />}
        </Fragment>
      );
    }
    return (
      <Delayed waitBeforeShow={200}>
        <Redirect to="/signin" />
      </Delayed>
    );
  }
}

export default ProtectedRoute;
