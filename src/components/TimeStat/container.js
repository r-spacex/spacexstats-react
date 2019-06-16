import React from 'react';
import PropTypes from 'prop-types';
import TimeStat from './component';

const onIntervalHOC = (propFunc, interval) => Component =>
  class OnInterval extends React.Component {
    constructor(props) {
      super(props);
      this.state = propFunc(props);
    }

    componentWillMount() {
      this.interval = setInterval(this.update, interval);
    }

    componentWillReceiveProps(newProps) {
      this.update(newProps);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    update = newProps => this.setState(propFunc(newProps || this.props));

    render() {
      return (
        <Component {...this.props} {...this.state}>
          {this.children}
        </Component>
      );
    }
  };

const calculateDuration = props => ({
  value: (props.value.getTime() - Math.floor(Date.now())) / 1000
});

const TimeStatContainer = ({ type, value }) => {
  const Component = type === 'duration' ? TimeStat : onIntervalHOC(calculateDuration, 1000)(TimeStat);

  return <Component value={value} />;
};

TimeStatContainer.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  type: PropTypes.string.isRequired
};

export default TimeStatContainer;
