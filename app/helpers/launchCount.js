const launchCount = (pastLaunches) => {
  let totalLaunches = 0;
  let totalFalcon9 = 0;
  let totalFalcon1 = 0;
  let totalFalconHeavy = 0;
  let totalBFR = 0;

  for (let i = 0; i < pastLaunches.length; i++) {
    totalLaunches++;

    switch (pastLaunches[i].rocket.rocket_id) {
      case 'falcon1':
        totalFalcon1++;
        break;

      case 'falcon9':
        totalFalcon9++;
        break;

      case 'falconheavy':
        totalFalconHeavy++;
        break;

      case 'bfr':
        totalBFR++;
        break;

      default:
    }
  }

  return {
    totalLaunches,
    totalFalcon9,
    totalFalcon1,
    totalFalconHeavy,
    totalBFR,
  };
};

export default launchCount;
