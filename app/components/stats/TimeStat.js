import PropTypes from 'prop-types';
import React from 'react';

import './TimeStat.styl';

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_S = 60;
const ONE_HOUR_IN_S = ONE_MINUTE_IN_S * 60;
const ONE_DAY_IN_S = ONE_HOUR_IN_S * 24;

const TimeStat = props => {
  let secondsLeft = Math.floor(Math.abs(props.data));
  const days = Math.floor(secondsLeft / ONE_DAY_IN_S);
  secondsLeft -= ONE_DAY_IN_S * days;
  const hours = Math.floor(secondsLeft / ONE_HOUR_IN_S);
  secondsLeft -= ONE_HOUR_IN_S * hours;
  const minutes = Math.floor(secondsLeft / ONE_MINUTE_IN_S);
  secondsLeft -= ONE_MINUTE_IN_S * minutes;
  const seconds = Math.floor(secondsLeft);

  return (
    <div className="TimeStat text-center text-uppercase full-width padded">
      <div className="fx-row fx-around-xs">
        <div className={`fx-col-xs${days < 10 ? '-2' : ''} fx-col`}>
          <div className="TimeStat__value">{days.toLocaleString()}</div>
          <div className="TimeStat__subtitle">Days</div>
        </div>
        <div className="fx-col-xs-2 fx-col">
          <div className="TimeStat__value">{hours.toLocaleString()}</div>
          <div className="TimeStat__subtitle">Hours</div>
        </div>
        <div className="fx-col-xs-2 fx-col">
          <div className="TimeStat__value">{minutes.toLocaleString()}</div>
          <div className="TimeStat__subtitle">Minutes</div>
        </div>
        <div className="fx-col-xs-2 fx-col">
          <div className="TimeStat__value">{seconds.toLocaleString()}</div>
          <div className="TimeStat__subtitle">Seconds</div>
        </div>
      </div>
    </div>
  );
};

TimeStat.propTypes = {
  data: PropTypes.number.isRequired // Unix timestamp
};

const onInterval = (propFunc, interval) => Component =>
  class OnInterval extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = propFunc(this.props);
    }
    componentWillMount() {
      this.update = newProps => this.setState(propFunc(newProps || this.props));
      this.interval = setInterval(this.update, interval);
    }

    componentWillReceiveProps(newProps) {
      this.update(newProps);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
      return (
        <Component {...this.props} {...this.state}>
          {this.children}
        </Component>
      );
    }
  };

const calculateDuration = props => ({
  data: props.data - Math.floor(Date.now() / ONE_SECOND_IN_MS)
});

const isDuration = props => props.type === 'duration';

const either = (predicate, A, B) => props => (predicate(props) ? <A {...props} /> : <B {...props} />);

export default either(isDuration, TimeStat, onInterval(calculateDuration, ONE_SECOND_IN_MS)(TimeStat));
