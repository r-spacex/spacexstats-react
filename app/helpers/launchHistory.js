import settings from 'settings';

const launchHistory = (pastLaunches) => {
  const yearsStart = 2006; // First Falcon 1 flight
  const yearsEnd = new Date().getFullYear();
  const years = [];
  for (let i = yearsStart; i <= yearsEnd; i++) {
    years.push(i);
  }

  // Custom years for upmass
  const yearsUpmassStart = 2008; // Going beyond suborbital a decade before BO
  const yearsUpmass = [];
  for (let i = yearsUpmassStart; i <= yearsEnd; i++) {
    yearsUpmass.push(i);
  }

  const falcon1Flights = new Array(years.length).fill(0);
  const falcon9UnprovenFlights = new Array(years.length).fill(0);
  const falcon9ProvenFlights = new Array(years.length).fill(0);
  const falconHeavyFlights = new Array(years.length).fill(0);
  const failureFlights = new Array(years.length).fill(0);
  const plannedFlights = new Array(years.length).fill(0);

  const upmassPerOrbit = {
    LEO: new Array(yearsUpmass.length).fill(0),
    ISS: new Array(yearsUpmass.length).fill(0),
    Polar: new Array(yearsUpmass.length).fill(0),
    GTO: new Array(yearsUpmass.length).fill(0),
    Interplanetary: new Array(yearsUpmass.length).fill(0),
    Other: new Array(yearsUpmass.length).fill(0),
  };

  const flights = [];
  const successRateFalcon9 = [];
  const successRateAll = [];
  let falcon9LaunchesCount = 0;
  let failuresFalcon9 = 0;
  let failuresAll = 0;

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];
    flights.push(`#${i + 1}`);

    // Build success rate chart
    if (launch.launch_success === false) {
      failuresAll++;
      if (launch.rocket.rocket_id === 'falcon9') {
        failuresFalcon9++;
      }
    }
    if (launch.rocket.rocket_id === 'falcon9') {
      falcon9LaunchesCount++;
      successRateFalcon9.push(100 * (falcon9LaunchesCount - failuresFalcon9) / falcon9LaunchesCount);
    } else {
      successRateFalcon9.push(null);
    }
    successRateAll.push(100 * (i + 1 - failuresAll) / (i + 1));

    // If failure, put in failures then ignore
    const yearIndex = launch.launch_year - yearsStart;
    if (launch.launch_success === false) {
      failureFlights[yearIndex]++;
      continue;
    }

    switch (launch.rocket.rocket_id) {
      case 'falcon1':
        falcon1Flights[yearIndex]++;
        break;

      case 'falcon9':
        if (launch.reused) {
          falcon9ProvenFlights[yearIndex]++;
        } else {
          falcon9UnprovenFlights[yearIndex]++;
        }
        break;

      case 'falconheavy':
        falconHeavyFlights[yearIndex]++;
        break;

      default:
    }

    // If success, add upmass to orbit
    // LEO, ISS, Polar, GTO, ES-L1, SSO
    if (!launch.launch_success) {
      continue;
    }

    let upmass = 0;
    for (let j = 0; j < launch.payloads.length; j++) {
      upmass += launch.payloads[j].payload_mass_kg;
    }

    const yearUpmassIndex = launch.launch_year - yearsUpmassStart;
    switch (launch.payloads[0].orbit) {
      case 'LEO': upmassPerOrbit.LEO[yearUpmassIndex] += upmass; break;
      case 'ISS': upmassPerOrbit.ISS[yearUpmassIndex] += upmass; break;
      case 'Polar': upmassPerOrbit.Polar[yearUpmassIndex] += upmass; break;
      case 'GTO': upmassPerOrbit.GTO[yearUpmassIndex] += upmass; break;
      case 'ES-L1':
        upmassPerOrbit.Interplanetary[yearUpmassIndex] += upmass;
        break;

      default: upmassPerOrbit.Other[yearUpmassIndex] += upmass;
    }
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));

  // Manually add planned launches for 2017 and 2018
  const plannedTarget2017 = 20;
  const plannedTarget2018 = 30;
  const totalFlightsThisYear =
    falcon9UnprovenFlights[falcon9UnprovenFlights.length - 1] +
    falcon9ProvenFlights[falcon9ProvenFlights.length - 1] +
    falconHeavyFlights[falconHeavyFlights.length - 1];
  if (yearsEnd === 2017) {
    plannedFlights[plannedFlights.length - 1] = plannedTarget2017 - totalFlightsThisYear;
    years.push(2018);
    plannedFlights.push(plannedTarget2018);
  } else if (yearsEnd === 2018) { // We are in 2018
    plannedFlights[plannedFlights.length - 1] = plannedTarget2018 - totalFlightsThisYear;
  }

  const optionsLaunchHistory = JSON.parse(JSON.stringify(options));
  optionsLaunchHistory.tooltips = {
    mode: 'label',
    callbacks: {
      afterTitle: () => {
        window.launchTotal = 0;
      },
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const count = parseFloat(dataset.data[tooltipItem.index]);
        window.launchTotal += count;

        if (count === 0) { return ''; }
        return dataset.label + ': ' + count.toLocaleString();
      },
      footer: () => {
        return 'TOTAL: ' + window.launchTotal.toLocaleString();
      },
    },
  };

  const flightsPerYear = {
    data: {
      labels: years,
      datasets: [{
        label: 'Falcon 1',
        backgroundColor: settings.COLORS.green,
        data: falcon1Flights,
      }, {
        label: 'New Falcon 9',
        backgroundColor: settings.COLORS.blue,
        data: falcon9UnprovenFlights,
      }, {
        label: 'Used Falcon 9',
        backgroundColor: settings.COLORS.lightblue,
        data: falcon9ProvenFlights,
      }, {
        label: 'Falcon Heavy',
        backgroundColor: settings.COLORS.yellow,
        data: falconHeavyFlights,
      }, {
        label: 'Failure',
        backgroundColor: settings.COLORS.red,
        data: failureFlights,
      }, {
        label: 'Planned',
        backgroundColor: settings.COLORS.white,
        data: plannedFlights,
      }]
    },
    options: optionsLaunchHistory,
  };

  const optionsSuccessRate = JSON.parse(JSON.stringify(options));
  optionsSuccessRate.scales.xAxes[0].stacked = false;
  optionsSuccessRate.scales.yAxes[0].stacked = false;
  optionsSuccessRate.tooltips = {
    mode: 'label',
    callbacks: {
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const rate = parseFloat(dataset.data[tooltipItem.index]);
        window.total += rate;
        return dataset.label + ': ' + rate.toFixed(2) + '%';
      },
    },
  };

  const successRates = {
    data: {
      labels: flights,
      datasets: [{
        label: 'Falcon 9',
        type: 'line',
        data: successRateFalcon9,
        fill: false,
        borderColor: settings.COLORS.yellow,
        backgroundColor: settings.COLORS.yellow,
        pointBorderColor: settings.COLORS.yellow,
        pointBackgroundColor: settings.COLORS.yellow,
        pointHoverBackgroundColor: settings.COLORS.yellow,
        pointHoverBorderColor: settings.COLORS.yellow,
      }, {
        label: 'All rockets',
        type: 'line',
        data: successRateAll,
        fill: false,
        borderColor: settings.COLORS.blue,
        backgroundColor: settings.COLORS.blue,
        pointBorderColor: settings.COLORS.blue,
        pointBackgroundColor: settings.COLORS.blue,
        pointHoverBackgroundColor: settings.COLORS.blue,
        pointHoverBorderColor: settings.COLORS.blue,
      }]
    },
    options: optionsSuccessRate,
  };

  const optionsUpmassPerYear = JSON.parse(JSON.stringify(options));
  optionsUpmassPerYear.tooltips = {
    mode: 'label',
    callbacks: {
      afterTitle: () => {
        window.launchTotal = 0;
      },
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const count = parseFloat(dataset.data[tooltipItem.index]);
        window.launchTotal += count;

        if (count === 0) { return ''; }
        return dataset.label + ': ' + count.toLocaleString() + 'kg';
      },
      footer: () => {
        return 'TOTAL: ' + window.launchTotal.toLocaleString() + 'kg';
      },
    },
  };

  const upmassPerYear = {
    data: {
      labels: yearsUpmass,
      datasets: [{
        label: 'LEO',
        backgroundColor: settings.COLORS.blue,
        data: upmassPerOrbit.LEO,
      }, {
        label: 'ISS',
        backgroundColor: settings.COLORS.lightblue,
        data: upmassPerOrbit.ISS,
      }, {
        label: 'Polar',
        backgroundColor: settings.COLORS.yellow,
        data: upmassPerOrbit.Polar,
      }, {
        label: 'GTO',
        backgroundColor: settings.COLORS.orange,
        data: upmassPerOrbit.GTO,
      }, {
        label: 'Interplanetary',
        backgroundColor: settings.COLORS.red,
        data: upmassPerOrbit.Interplanetary,
      }, {
        label: 'Other',
        backgroundColor: settings.COLORS.white,
        data: upmassPerOrbit.Other,
      }]
    },
    options: optionsUpmassPerYear,
  };

  return {
    flightsPerYear,
    successRates,
    upmassPerYear,
  };
};

export default launchHistory;
