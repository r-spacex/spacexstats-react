import settings from 'settings';
import { chartColors } from 'stylesheet';

const modelizer = ({ pastLaunches, upcomingLaunches }) => {
  const yearsStart = 2006; // First Falcon 1 flight
  const yearsEnd = upcomingLaunches
    .map((launch) => launch.launch_year)
    .sort()
    .slice(-1)
    .pop();
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

  const flights = [];
  const successRateFalcon9 = [];
  const successRateFalconHeavy = [];
  const successRateAll = [];
  let falcon9LaunchesCount = 0;
  let failuresFalcon9 = 0;
  let falconHeavyLaunchesCount = 0;
  let failuresFalconHeavy = 0;
  let failuresAll = 0;

  for (let i = 1; i < pastLaunches.length + 1; i++) {
    const launch = pastLaunches[i - 1];
    flights.push(`#${i}`);

    // Build success rate chart
    if (launch.launch_success === false) {
      failuresAll += 1;
      if (launch.rocket.rocket_id === 'falcon9') {
        failuresFalcon9 += 1;
      }
      if (launch.rocket.rocket_id === 'falconheavy') {
        failuresFalconHeavy += 1;
      }
    }
    if (launch.rocket.rocket_id === 'falcon9') {
      falcon9LaunchesCount += 1;
      const ratio =
        (falcon9LaunchesCount - failuresFalcon9) / falcon9LaunchesCount;
      successRateFalcon9.push(100 * ratio);
    } else {
      successRateFalcon9.push(
        successRateFalcon9[successRateFalcon9.length - 1],
      );
    }
    if (launch.rocket.rocket_id === 'falconheavy') {
      falconHeavyLaunchesCount += 1;
      const ratio =
        (falconHeavyLaunchesCount - failuresFalconHeavy) /
        falconHeavyLaunchesCount;
      successRateFalconHeavy.push(100 * ratio);
    } else {
      successRateFalconHeavy.push(
        successRateFalconHeavy[successRateFalconHeavy.length - 1],
      );
    }
    successRateAll.push((100 * (i - failuresAll)) / i);

    // If failure, put in failures then ignore
    const yearIndex = launch.launch_year - yearsStart;

    if (launch.launch_success) {
      switch (launch.rocket.rocket_id) {
        case 'falcon1':
          falcon1Flights[yearIndex] += 1;
          break;

        case 'falcon9':
          if (launch.rocket.first_stage.cores[0].reused) {
            falcon9ProvenFlights[yearIndex] += 1;
          } else {
            falcon9UnprovenFlights[yearIndex] += 1;
          }
          break;

        case 'falconheavy':
          falconHeavyFlights[yearIndex] += 1;
          break;

        default:
      }
    } else {
      failureFlights[yearIndex] += 1;
    }
  }

  for (let j = 0; j < upcomingLaunches.length; j++) {
    const yearIndex = upcomingLaunches[j].launch_year - yearsStart;
    plannedFlights[yearIndex] += 1;
  }

  let options = JSON.parse(JSON.stringify(settings.DEFAULTCHARTOPTIONS)); // Clone object
  options = Object.assign(
    options,
    JSON.parse(JSON.stringify(settings.DEFAULTBARCHARTOPTIONS)),
  );

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

        if (count === 0) {
          return '';
        }
        return `${dataset.label}: ${count.toLocaleString()}`;
      },
      footer: () => `TOTAL: ${window.launchTotal.toLocaleString()}`,
    },
  };

  const flightsPerYear = {
    data: {
      labels: years,
      datasets: [
        {
          label: 'Falcon 1',
          backgroundColor: chartColors.green,
          data: falcon1Flights,
        },
        {
          label: 'New Falcon 9',
          backgroundColor: chartColors.blue,
          data: falcon9UnprovenFlights,
        },
        {
          label: 'Used Falcon 9',
          backgroundColor: chartColors.lightblue,
          data: falcon9ProvenFlights,
        },
        {
          label: 'Falcon Heavy',
          backgroundColor: chartColors.yellow,
          data: falconHeavyFlights,
        },
        {
          label: 'Failure',
          backgroundColor: chartColors.red,
          data: failureFlights,
        },
        {
          label: 'Planned',
          backgroundColor: chartColors.white,
          data: plannedFlights,
        },
      ],
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
        return `${dataset.label}: ${rate.toFixed(2)}%`;
      },
    },
  };

  const successRates = {
    data: {
      labels: flights,
      datasets: [
        {
          label: 'Falcon 9',
          type: 'line',
          data: successRateFalcon9,
          fill: false,
          borderColor: chartColors.yellow,
          backgroundColor: chartColors.yellow,
          pointBorderColor: chartColors.yellow,
          pointBackgroundColor: chartColors.yellow,
          pointHoverBackgroundColor: chartColors.yellow,
          pointHoverBorderColor: chartColors.yellow,
        },
        {
          label: 'Falcon Heavy',
          type: 'line',
          data: successRateFalconHeavy,
          fill: false,
          borderColor: chartColors.green,
          backgroundColor: chartColors.green,
          pointBorderColor: chartColors.green,
          pointBackgroundColor: chartColors.green,
          pointHoverBackgroundColor: chartColors.green,
          pointHoverBorderColor: chartColors.green,
        },
        {
          label: 'All rockets',
          type: 'line',
          data: successRateAll,
          fill: false,
          borderColor: chartColors.blue,
          backgroundColor: chartColors.blue,
          pointBorderColor: chartColors.blue,
          pointBackgroundColor: chartColors.blue,
          pointHoverBackgroundColor: chartColors.blue,
          pointHoverBorderColor: chartColors.blue,
        },
      ],
    },
    options: optionsSuccessRate,
  };

  return {
    flightsPerYear,
    successRates,
  };
};

export default modelizer;
