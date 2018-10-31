import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
// const ProtectedRoute = ({ isAllowed, ...props }) => (isAllowed
//   ? <Route {...props} />
//   : <Redirect to="/signin" />);

class ProtectedRoute extends PureComponent {
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

    return (
      <React.Fragment>
        {hasRecievedUpdatedProps ? isAllowed
          ? <Route {...props} />
          : <Redirect to="/signin" /> : null}
      </React.Fragment>
    );
  }
}

export default ProtectedRoute;
