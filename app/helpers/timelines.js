import moment from 'moment';

const timelines = () => {
  return {
    elonMuskBet: moment('2026-01-01').unix(),
    foundingDate: moment('2002-03-14').unix(),
    falconHeavyLaunchDate: moment().days(180).unix(),
  };
};

export default timelines;
