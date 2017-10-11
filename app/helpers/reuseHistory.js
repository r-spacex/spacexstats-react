import settings from 'settings';

const reuseHistory = (pastLaunches) => {
  let totalLanded = 0;
  let totalReflown = 0;
  const totalFairingsReflown = 0;
  const cores = {};
  let quickestTurnaround = null;
  let quickestTurnaroundCore = null;
  let mostReflownCore = null;
  let quickestTurnaroundMission1 = null;
  let quickestTurnaroundMission2 = null;

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
    const launchDate = new Date(launch.launch_date_utc).getTime() / 1000;
    let turnaround = null;

    // Ignore Falcon 1
    if (launch.rocket.rocket_id === 'falcon1') {
      continue;
    }

    if (!(launch.core_serial in cores)) {
      cores[launch.core_serial] = {
        'reflown': false,
        'launches': new Array(),
      };
    } else {
      totalReflown++;
      cores[launch.core_serial].reflown = true;
      const previousLaunches = cores[launch.core_serial].launches;
      const previousLaunch = previousLaunches[previousLaunches.length - 1];
      turnaround = launchDate - previousLaunch.date;

      // Check for most reflown core
      if (mostReflownCore === null
        || previousLaunches.length + 1 > cores[mostReflownCore].launches.length) {
        mostReflownCore = launch.core_serial;
      }

      // Check for quickest turnaround
      if (quickestTurnaround === null
        || turnaround < quickestTurnaround) {
        quickestTurnaround = turnaround;
        quickestTurnaroundCore = launch.core_serial;
        quickestTurnaroundMission1 = previousLaunch.name;
        quickestTurnaroundMission2 = launch.payloads[0].payload_id;
      }
    }

    cores[launch.core_serial].launches.push({
      name: launch.payloads[0].payload_id,
      date: launchDate,
      turnaround,
    });

    if (launch.land_success && launch.landing_type !== 'Ocean') {
      totalLanded++;
    }

    // Landing history chart
    const yearIndex = launch.launch_year - yearsStart;
    if (launch.landing_type !== null && launch.land_success === false) {
      failureLandings[yearIndex]++;
      continue;
    }
    switch (launch.landing_type) {
      case 'Ocean':
        oceanLandings[yearIndex]++;
        break;
      case 'RTLS':
        rtlsLandings[yearIndex]++;
        break;
      case 'ASDS':
        if (launch.landing_vehicle === 'JRTI') {
          jrtiLandings[yearIndex]++;
        } else if (launch.landing_vehicle === 'OCISLY') {
          ocislyLandings[yearIndex]++;
        }
        break;

      default:
    }
  }

  // Get mission names of most reflown core
  const mostReflownCoreMissions = [];
  for (let i = 0; i < cores[mostReflownCore].launches.length; i++) {
    mostReflownCoreMissions.push(cores[mostReflownCore].launches[i].name);
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

  const landingHistory = {
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
        label: 'ASDS : OCISLY',
        backgroundColor: settings.COLORS.white,
        data: ocislyLandings,
      }, {
        label: 'ASDS : JRTI',
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
    landingHistory,
    totalReflown,
    totalFairingsReflown,
    quickestReuseTurnaround: {
      core: quickestTurnaroundCore,
      mission1: quickestTurnaroundMission1,
      mission2: quickestTurnaroundMission2,
      turnaround: quickestTurnaround,
    },
    mostReflownCore: {
      launches: cores[mostReflownCore].launches.length,
      missions: mostReflownCoreMissions.join(', '),
      core: mostReflownCore,
    },
  };
};

export default reuseHistory;
