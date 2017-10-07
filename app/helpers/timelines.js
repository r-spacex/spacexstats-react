const timelines = () => {
  return {
    elonMuskBet: (new Date('2026-01-01').getTime() / 1000),
    foundingDate: (new Date('2002-03-14').getTime() / 1000),
    falconHeavyLaunchDate: ((new Date().getTime() / 1000) + 6 * 30 * 24 * 3600),
  };
};

export default timelines;
