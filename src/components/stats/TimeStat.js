import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { fonts, thresholds } from 'stylesheet';

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_S = 60;
const ONE_HOUR_IN_S = ONE_MINUTE_IN_S * 60;
const ONE_DAY_IN_S = ONE_HOUR_IN_S * 24;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  ${fonts.special}
  text-transform: uppercase;
`;

const Value = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 2ch;
  line-height: 1;

  font-size: 2.5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 7rem;
  }
  @media (min-width: ${thresholds.md}) {
    font-size: 10rem;
  }
`;

const Subtitle = styled.div`
  font-size: 1rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 2rem;
  }
`;

const TimeStat = ({ data }) => {
  let secondsLeft = Math.floor(Math.abs(data));
  const days = Math.floor(secondsLeft / ONE_DAY_IN_S);
  secondsLeft -= ONE_DAY_IN_S * days;
  const hours = Math.floor(secondsLeft / ONE_HOUR_IN_S);
  secondsLeft -= ONE_HOUR_IN_S * hours;
  const minutes = Math.floor(secondsLeft / ONE_MINUTE_IN_S);
  secondsLeft -= ONE_MINUTE_IN_S * minutes;
  const seconds = Math.floor(secondsLeft);

  return (
    <Wrapper>
      <Value>
        {days.toLocaleString()}
        <Subtitle>Days</Subtitle>
      </Value>
      <Value>
        {hours.toLocaleString()}
        <Subtitle>Hours</Subtitle>
      </Value>
      <Value>
        {minutes.toLocaleString()}
        <Subtitle>Minutes</Subtitle>
      </Value>
      <Value>
        {seconds.toLocaleString()}
        <Subtitle>Seconds</Subtitle>{' '}
      </Value>
    </Wrapper>
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
