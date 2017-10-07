import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimeStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    this.duration = null;
  }

  componentWillMount() {
    this.initTimer(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      if (this.props.type === 'timer' || this.props.type === 'countdown') {
        clearInterval(this.interval);
      }
      this.initTimer(newProps);
    }
  }

  componentWillUnmount() {
    if (this.props.type === 'timer' || this.props.type === 'countdown') {
      clearInterval(this.interval);
    }
  }

  initTimer = (props) => {
    if (props.type === 'duration') {
      this.duration = props.data;
      this.updateTimer();
      return;
    }

    const eventTime = props.data;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    this.duration = eventTime - currentTime;

    if (this.duration < 0) {
      this.duration = - this.duration;
    }

    this.updateTimer();
    this.interval = setInterval(this.updateTimer, 1000);
  }

  updateTimer = () => {
    const factor = this.props.type === 'countdown' ? -1 : 1;
    this.duration = this.duration + factor;

    let secondsLeft = this.duration;
    const days = Math.floor(secondsLeft / (60 * 60 * 24));
    secondsLeft -= 60 * 60 * 24 * days;
    const hours = Math.floor(secondsLeft / (60 * 60));
    secondsLeft -= 60 * 60 * hours;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= 60 * minutes;
    const seconds = Math.floor(secondsLeft);

    this.setState({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    });
  }

  render() {
    return (
      <div className="TimeStat text-center text-uppercase full-width padded">
        <div className="fx-row fx-around-xs">
          <div className={`fx-col-xs${this.state.days < 10 ? '-2' : ''} fx-col`}>
            <div className="TimeStat__value">{this.state.days.toLocaleString()}</div>
            <div className="TimeStat__subtitle">Days</div>
          </div>
          <div className="fx-col-xs-2 fx-col">
            <div className="TimeStat__value">{this.state.hours.toLocaleString()}</div>
            <div className="TimeStat__subtitle">Hours</div>
          </div>
          <div className="fx-col-xs-2 fx-col">
            <div className="TimeStat__value">{this.state.minutes.toLocaleString()}</div>
            <div className="TimeStat__subtitle">Minutes</div>
          </div>
          <div className="fx-col-xs-2 fx-col">
            <div className="TimeStat__value">{this.state.seconds.toLocaleString()}</div>
            <div className="TimeStat__subtitle">Seconds</div>
          </div>
        </div>
      </div>
    );
  }
}

TimeStat.propTypes = {
  data: PropTypes.number.isRequired, // Unix timestamp
  type: PropTypes.string.isRequired,
};

export default TimeStat;
