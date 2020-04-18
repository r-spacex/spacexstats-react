import { fromUnix } from 'utils';

const modelizer = ({ pastLaunches }) => {
  let totalLaunches = 0;
  let totalFalcon9 = 0;
  let totalFalcon1 = 0;
  let totalFalconHeavy = 0;
  let totalBFR = 0;

  let totalFalcon9Upmass = 0;
  let totalFalcon1Upmass = 0;
  let totalFalconHeavyUpmass = 0;
  let totalBFRUpmass = 0;

  pastLaunches.forEach((launch) => {
    totalLaunches += 1;

    let upmass = 0;
    if (launch.launch_success) {
      launch.rocket.second_stage.payloads.forEach((payload) => {
        upmass += payload.payload_mass_kg;
      });
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
  });

  // Manually remove Amos-6 mission from launch count.
  // This *mission* was a failure but it never technically *launched*
  // Handling this exception in the API with a distinct parameter would be almost useless
  totalFalcon9 -= 1;
  totalLaunches -= 1;

  const lastLaunchDate = fromUnix(
    pastLaunches[pastLaunches.length - 1].launch_date_unix,
  );

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
    lastLaunchDate,
  };
};

export default modelizer;
