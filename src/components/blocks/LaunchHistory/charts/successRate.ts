import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Rocket, Launch } from 'types';

const computeSuccessRate = (
  pastLaunches: Launch[],
  flightNumber: number,
  rocketType?: Rocket,
): number => {
  const givenLaunch = pastLaunches[flightNumber];
  const launchesUpToThatPoint = pastLaunches.filter(
    ({ date, rocket }) =>
      date <= givenLaunch.date && (!rocketType || rocket === rocketType),
  );

  const launchSuccess = launchesUpToThatPoint.filter(
    ({ success }) => success,
  ).length;

  return (100 * launchSuccess) / launchesUpToThatPoint.length;
};

export const buildSuccessRateChart = (pastLaunches: Launch[]) => {
  pastLaunches.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    return -1;
  });
  const flightNumbers = pastLaunches.map((_value, index) => index);

  const data = {
    labels: flightNumbers.map((value) => `#${value + 1}`),
    datasets: [
      {
        label: 'Falcon 1',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber, Rocket.f1),
        ),
        fill: false,
        borderColor: chartColors.white,
        backgroundColor: chartColors.white,
      },
      {
        label: 'Falcon 9',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber, Rocket.f9),
        ),
        fill: false,
        borderColor: chartColors.yellow,
        backgroundColor: chartColors.yellow,
      },
      {
        label: 'Falcon Heavy',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber, Rocket.fh),
        ),
        fill: false,
        borderColor: chartColors.green,
        backgroundColor: chartColors.green,
      },
      {
        label: 'All rockets',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber),
        ),
        fill: false,
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blue,
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          if (!data.datasets) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex!];
          return tooltipItem.yLabel
            ? `${dataset.label}: ${(tooltipItem.yLabel as number).toFixed(2)}%`
            : '';
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].ticks.callback = (label) => `${label}%`;
  }

  return { data, options };
};
