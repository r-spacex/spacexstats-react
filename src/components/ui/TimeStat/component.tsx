import React from 'react';
import { Wrapper, Value, Subtitle } from './style';

const ONE_MINUTE_IN_S = 60;
const ONE_HOUR_IN_S = ONE_MINUTE_IN_S * 60;
const ONE_DAY_IN_S = ONE_HOUR_IN_S * 24;

interface Props {
  value: number;
}

const TimeStat: React.FC<Props> = ({ value }) => {
  let secondsLeft = Math.floor(Math.abs(value));
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

export default TimeStat;
