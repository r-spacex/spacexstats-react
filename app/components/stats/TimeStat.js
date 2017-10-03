import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
    const eventTime = this.props.data.unix();
    const currentTime = moment().unix();
    const diffTime = eventTime - currentTime;
    this.duration = moment.duration(diffTime * 1000, 'milliseconds');

    if (this.duration < 0) {
      this.duration = - this.duration;
    }

    this.updateTimer();
    setInterval(this.updateTimer, 1000);
  }

  updateTimer = () => {
    const factor = this.props.type === 'countdown' ? -1 : 1;

    this.duration = moment.duration(this.duration.asMilliseconds() + 1000 * factor, 'milliseconds');
    const momentDuration = moment.duration(this.duration);

    // show how many hours, minutes and seconds are left
    this.setState({
      days: momentDuration.days(),
      hours: momentDuration.hours(),
      minutes: momentDuration.minutes(),
      seconds: momentDuration.seconds(),
    });
  }

  render() {
    return (
      <div className="TimeStat text-center full-width">
        <div className="TimeStat__value fx-row fx-center-xs">
          <div className="fx-col-xs-2">{this.state.days}</div>
          <div className="fx-col-xs-2">{this.state.hours}</div>
          <div className="fx-col-xs-2">{this.state.minutes}</div>
          <div className="fx-col-xs-2">{this.state.seconds}</div>
        </div>
        <div className="TimeStat__subtitle fx-row fx-center-xs text-uppercase">
          <div className="fx-col-xs-2">Days</div>
          <div className="fx-col-xs-2">Hours</div>
          <div className="fx-col-xs-2">Minutes</div>
          <div className="fx-col-xs-2">Seconds</div>
        </div>
      </div>
    );
  }
}

TimeStat.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default TimeStat;
