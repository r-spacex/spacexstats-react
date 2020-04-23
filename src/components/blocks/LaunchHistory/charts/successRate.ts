import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { RocketType, Launch } from 'types';

const computeSuccessRate = (
  pastLaunches: Launch[],
  flightNumber: number,
  rocketType?: RocketType,
): number => {
  const launchesUpToThatPoint = pastLaunches.filter(
    ({ flight_number, rocket }) =>
      flight_number <= flightNumber &&
      (!rocketType || rocket.rocket_id === rocketType),
  );

  const launchSuccess = launchesUpToThatPoint.filter(
    ({ launch_success }) => launch_success,
  ).length;

  return (100 * launchSuccess) / launchesUpToThatPoint.length;
};

export const buildSuccessRateChart = (pastLaunches: Launch[]) => {
  const flightNumbers = pastLaunches.map(({ flight_number }) => flight_number);

  const data = {
    labels: flightNumbers.map((flight_number) => `#${flight_number}`),
    datasets: [
      {
        label: 'Falcon 9',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber, RocketType.f9),
        ),
        fill: false,
        borderColor: chartColors.yellow,
        backgroundColor: chartColors.yellow,
      },
      {
        label: 'Falcon Heavy',
        type: 'line',
        data: flightNumbers.map((flightNumber) =>
          computeSuccessRate(pastLaunches, flightNumber, RocketType.fh),
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

  return { data, options };
};
