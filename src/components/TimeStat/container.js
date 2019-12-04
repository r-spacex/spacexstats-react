import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimeStat from './component';

const calculateDuration = value => (value.getTime() - Math.floor(Date.now())) / 1000;

const TimeStatContainer = ({ type, value }) => {
  const [time, setTime] = useState(type === 'duration' ? value : calculateDuration(value));

  useEffect(() => {
    setTimeout(() => {
      if (type !== 'duration') {
        setTime(calculateDuration(value));
      }
    }, 1000);
  });

  return <TimeStat value={time} />;
};

TimeStatContainer.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  type: PropTypes.string.isRequired
};

export default TimeStatContainer;
