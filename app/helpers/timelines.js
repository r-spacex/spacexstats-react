import moment from 'moment';

const timelines = () => {
  return {
    elonMuskBet: moment('2026-01-01'),
    foundingDate: moment('2002-03-14'),
    falconHeavyLaunchDate: moment().days(180),
  };
};

export default timelines;
