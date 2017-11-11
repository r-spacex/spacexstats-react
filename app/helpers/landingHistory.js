import settings from 'settings';

const landingHistory = (pastLaunches) => {
  let totalLanded = 0;
  let heaviestLanding = {mass: 0, mission: '', landingType: ''};
  let heaviestLandingGTO = {mass: 0, mission: '', landingType: ''};

  // For landing history graph
  const yearsStart = 2013; // First landing attempt
  const yearsEnd = new Date().getFullYear();
  const years = [];
  for (let i = yearsStart; i <= yearsEnd; i++) {
    years.push(i);
  }
  const oceanLandings = new Array(years.length).fill(0);
  const rtlsLandings = new Array(years.length).fill(0);
  const ocislyLandings = new Array(years.length).fill(0);
  const jrtiLandings = new Array(years.length).fill(0);
  const failureLandings = new Array(years.length).fill(0);

  // List cores
  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    // Ignore Falcon 1
    if (launch.rocket.rocket_id === 'falcon1') {
      continue;
    }

    if (launch.land_success && launch.landing_type !== 'Ocean') {
      totalLanded++;
    }

    // Landing history chart
    const yearIndex = launch.launch_year - yearsStart;
    if (launch.landing_type !== null && launch.land_success === false) {
      failureLandings[yearIndex]++;
      continue;
    }

    let formattedLandingType;
    switch (launch.landing_type) {
      case 'Ocean':
        oceanLandings[yearIndex]++;
        formattedLandingType = 'an ocean landing';
        break;
      case 'RTLS':
        rtlsLandings[yearIndex]++;
        formattedLandingType = 'a RTLS landing';
        break;
      case 'ASDS':
        if (launch.landing_vehicle === 'JRTI') {
          jrtiLandings[yearIndex]++;
          formattedLandingType = 'an ASDS landing on JRTI';
        } else if (launch.landing_vehicle === 'OCISLY') {
          ocislyLandings[yearIndex]++;
          formattedLandingType = 'an ASDS landing on OCISLY';
        }
        break;

      default:
        // Ignore non landed cores
        continue;
    }

    // Heaviest payload landings
    for (let j = 0; j < launch.payloads.length; j++) {
      const payload = launch.payloads[j];

      if (payload.payload_mass_kg > heaviestLanding.mass) {
        heaviestLanding = {
          mass: payload.payload_mass_kg,
          mission: payload.payload_id,
          landingType: formattedLandingType,
        };
      }

      if (payload.orbit === 'GTO' && payload.payload_mass_kg > heaviestLandingGTO.mass) {
        heaviestLandingGTO = {
          mass: payload.payload_mass_kg,
          mission: payload.payload_id,
          landingType: formattedLandingType,
        };
      }
    }
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));
  options.tooltips = {
    mode: 'label',
    callbacks: {
      afterTitle: () => {
        window.landingTotal = 0;
      },
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const count = parseFloat(dataset.data[tooltipItem.index]);
        window.landingTotal += count;
        window.landingFailures = 0;
        if (dataset.label === 'Failures') {
          window.landingFailures = count;
        }
        return dataset.label + ': ' + count.toString();
      },
      footer: () => {
        const total = window.landingTotal.toString();
        const rate = 100 * (total - window.landingFailures) / total;
        return `TOTAL: ${total} (${rate.toFixed(0)}% success rate)`;
      },
    },
  };

  const landingHistoryChart = {
    data: {
      labels: years,
      datasets: [{
        label: 'Ocean',
        backgroundColor: settings.COLORS.blue,
        data: oceanLandings,
      }, {
        label: 'RTLS',
        backgroundColor: settings.COLORS.green,
        data: rtlsLandings,
      }, {
        label: 'ASDS - OCISLY',
        backgroundColor: settings.COLORS.white,
        data: ocislyLandings,
      }, {
        label: 'ASDS - JRTI',
        backgroundColor: settings.COLORS.yellow,
        data: jrtiLandings,
      }, {
        label: 'Failures',
        backgroundColor: settings.COLORS.red,
        data: failureLandings,
      }]
    },
    options: options,
  };

  return {
    totalLanded,
    landingHistoryChart,
    heaviestLanding,
    heaviestLandingGTO,
  };
};

export default landingHistory;
