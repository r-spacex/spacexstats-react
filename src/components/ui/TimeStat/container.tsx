import React, { useState, useEffect } from 'react';
import TimeStat from './component';

const calculateDuration = (value: Date) =>
  (value.getTime() - Math.floor(Date.now())) / 1000;

interface Props {
  value: number | Date;
  type: string;
}

const TimeStatContainer: React.FC<Props> = ({ type, value }) => {
  const [time, setTime] = useState<number>(
    type === 'duration' ? (value as number) : calculateDuration(value as Date),
  );

  useEffect(() => {
    setTimeout(() => {
      if (type !== 'duration') {
        setTime(calculateDuration(value as Date));
      }
    }, 1000);
  });

  return <TimeStat value={time} />;
};

export default TimeStatContainer;
