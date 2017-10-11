import settings from 'settings';

const launchHistory = (pastLaunches) => {
  const yearsStart = 2006; // First Falcon 1 flight
  const yearsEnd = new Date().getFullYear();
  const years = [];
  for (let i = yearsStart; i <= yearsEnd; i++) {
    years.push(i);
  }

  const falcon1Flights = new Array(years.length).fill(0);
  const falcon9UnprovenFlights = new Array(years.length).fill(0);
  const falcon9ProvenFlights = new Array(years.length).fill(0);
  const falconHeavyUnprovenFlights = new Array(years.length).fill(0);
  const falconHeavyProvenFlights = new Array(years.length).fill(0);
  const failureFlights = new Array(years.length).fill(0);

  for (let i = 0; i < pastLaunches.length; i++) {
    const launch = pastLaunches[i];

    if (launch.launch_success === false) {
      failureFlights[launch.launch_year - yearsStart]++;
      continue;
    }

    switch (launch.rocket.rocket_id) {
      case 'falcon1':
        falcon1Flights[launch.launch_year - yearsStart]++;
        break;

      case 'falcon9':
        if (launch.reused) {
          falcon9ProvenFlights[launch.launch_year - yearsStart]++;
        } else {
          falcon9UnprovenFlights[launch.launch_year - yearsStart]++;
        }
        break;

      case 'falconheavy':
        if (launch.reused) {
          falconHeavyProvenFlights[launch.launch_year - yearsStart]++;
        } else {
          falconHeavyUnprovenFlights[launch.launch_year - yearsStart]++;
        }
        break;

      default:
    }
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(options, JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)));
  options.tooltips = {
    mode: 'label',
    callbacks: {
      afterTitle: () => {
        window.total = 0;
      },
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const count = parseFloat(dataset.data[tooltipItem.index]);
        window.total += count;
        return dataset.label + ': ' + count.toString();
      },
      footer: () => {
        return 'TOTAL: ' + window.total.toString();
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
        label: 'New Falcon Heavy',
        backgroundColor: settings.COLORS.orange,
        data: falconHeavyUnprovenFlights,
      }, {
        label: 'Used Falcon Heavy',
        backgroundColor: settings.COLORS.yellow,
        data: falconHeavyProvenFlights,
      }, {
        label: 'Failure',
        backgroundColor: settings.COLORS.red,
        data: failureFlights,
      }]
    },
    options: options,
  };

  return {
    flightsPerYear,
  };
};

export default launchHistory;
