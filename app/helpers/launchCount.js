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

  // Manually remove Amos-6 mission from launch count.
  // This *mission* was a failure but it never technically *launched*
  // Handling this exception in the API with a distinct parameter would be almost useless
  totalFalcon9--;
  totalLaunches--;

  return {
    totalLaunches,
    totalFalcon9,
    totalFalcon1,
    totalFalconHeavy,
    totalBFR,
  };
};

export default launchCount;
