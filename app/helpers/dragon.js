import settings from 'settings';

const payloads = (pastLaunches) => {
  let totalFlights = 0;
  let totalFlightTime = 0;
  let totalISSResupplies = 0;
  let totalCargoUp = 0;
  let totalCargoDown = 0;
  let totalReflights = 0;
  const crsLabels = [];
  const crsFlightTimes = [];
  const allCapsules = [];

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    const flightTime = 3600 * (Math.floor(Math.random() * 40) + 10); // FIXME

    if (launch.payloads[0].payload_type.indexOf('Dragon') === -1
      || launch.payloads[0].payload_id.indexOf('Dragon Qualification Unit') !== -1) {
      continue;
    }

    if (launch.launch_success) {
      totalFlights++;
      totalFlightTime += flightTime;

      // Check if reused
      if (allCapsules.indexOf(launch.cap_serial) !== -1) {
        totalReflights++;
      } else {
        allCapsules.push(launch.cap_serial);
      }
    }

    if (launch.payloads[0].payload_id.indexOf('CRS') !== -1) {
      if (launch.launch_success) {
        totalISSResupplies++;
        totalCargoUp += launch.payloads[0].payload_mass_kg;
        totalCargoDown += 0;  // FIXME
      }
      crsLabels.push(launch.payloads[0].payload_id.replace('SpaceX ', ''));
      crsFlightTimes.push(flightTime);
    }
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS));
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));

  const crsFlightTimesChart = {
    data: {
      labels: crsLabels,
      datasets: [{
        label: 'Flight times',
        backgroundColor: settings.COLORS.blue,
        data: crsFlightTimes,
      }],
    },
    options: options,
  };

  return {
    totalFlights,
    totalISSResupplies,
    totalFlightTime,
    crsFlightTimesChart,
    totalCargoUp,
    totalCargoDown,
    totalReflights,
  };
};

export default payloads;
