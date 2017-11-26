const launchCount = (pastLaunches) => {
  let totalLaunches = 0;
  let totalFalcon9 = 0;
  let totalFalcon1 = 0;
  let totalFalconHeavy = 0;
  let totalBFR = 0;

  let totalFalcon9Upmass = 0;
  let totalFalcon1Upmass = 0;
  let totalFalconHeavyUpmass = 0;
  let totalBFRUpmass = 0;

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    totalLaunches += 1;

    let upmass = 0;
    if (launch.launch_success) {
      for (let j = 0; j < launch.payloads.length; j++) {
        upmass += launch.payloads[j].payload_mass_kg;
      }
    }

    switch (launch.rocket.rocket_id) {
      case 'falcon1':
        totalFalcon1 += 1;
        totalFalcon1Upmass += upmass;
        break;

      case 'falcon9':
        totalFalcon9 += 1;
        totalFalcon9Upmass += upmass;
        break;

      case 'falconheavy':
        totalFalconHeavy += 1;
        totalFalconHeavyUpmass += upmass;
        break;

      case 'bfr':
        totalBFR += 1;
        totalBFRUpmass += upmass;
        break;

      default:
    }
  }

  // Manually remove Amos-6 mission from launch count.
  // This *mission* was a failure but it never technically *launched*
  // Handling this exception in the API with a distinct parameter would be almost useless
  totalFalcon9 -= 1;
  totalLaunches -= 1;

  return {
    totalLaunches,
    totalFalcon9,
    totalFalcon1,
    totalFalconHeavy,
    totalBFR,
    totalFalcon9Upmass,
    totalFalcon1Upmass,
    totalFalconHeavyUpmass,
    totalBFRUpmass,
  };
};

export default launchCount;
