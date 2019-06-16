import settings from 'settings';

const payloads = pastLaunches => {
  let totalFlights = 0;
  let totalFlightTime = 0;
  let totalISSResupplies = 0;
  let totalCargoUp = 0;
  let totalCargoDown = 0;
  let totalReflights = 0;
  const crsLabels = [];
  const crsFlightTimes = [];

  const dragonLaunches = pastLaunches.filter(
    launch =>
      launch.rocket.second_stage.payloads[0].payload_type.indexOf('Dragon') !== -1 &&
      launch.rocket.second_stage.payloads[0].payload_id.indexOf('Dragon Qualification Unit') === -1
  );

  dragonLaunches.forEach(launch => {
    const flightTime = launch.rocket.second_stage.payloads[0].flight_time_sec;

    if (launch.launch_success) {
      totalFlights += 1;

      if (Number.isInteger(flightTime)) {
        totalFlightTime += flightTime;
      }

      // Check if reused
      if (launch.reuse.capsule) {
        totalReflights += 1;
      }
    }

    if (launch.rocket.second_stage.payloads[0].payload_id.indexOf('CRS') !== -1) {
      if (launch.launch_success) {
        totalISSResupplies += 1;
        totalCargoUp += launch.rocket.second_stage.payloads[0].payload_mass_kg;
        totalCargoDown += launch.rocket.second_stage.payloads[0].mass_returned_kg;
      }
      crsLabels.push(launch.rocket.second_stage.payloads[0].payload_id.replace('SpaceX ', ''));
      crsFlightTimes.push((flightTime / 3600).toFixed(1));
    }
  });

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS));
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));
  options.tooltips = {
    mode: 'label',
    callbacks: {
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const flightTime = dataset.data[tooltipItem.index];
        return `${dataset.label} : ${flightTime} hours`;
      }
    }
  };

  const crsFlightTimesChart = {
    data: {
      labels: crsLabels,
      datasets: [
        {
          label: 'Flight times (hours)',
          backgroundColor: settings.COLORS.blue,
          data: crsFlightTimes
        }
      ]
    },
    options
  };

  return {
    totalFlights,
    totalISSResupplies,
    totalFlightTime,
    crsFlightTimesChart,
    totalCargoUp,
    totalCargoDown,
    totalReflights
  };
};

export default payloads;
