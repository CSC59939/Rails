import { Component } from 'react';
import PropTypes from 'prop-types';

class Delayed extends Component {
  static propTypes = {
    waitBeforeShow: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount() {
    const {
      waitBeforeShow,
    } = this.props;
    setTimeout(() => {
      this.setState({ hidden: false });
    }, waitBeforeShow);
  }

  render() {
    const {
      hidden,
    } = this.state;
    const {
      children,
    } = this.props;
    return hidden ? '' : children;
  }
}


export default Delayed;
