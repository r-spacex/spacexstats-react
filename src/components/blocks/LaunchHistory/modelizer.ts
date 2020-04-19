import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXData, RocketType, Launch } from 'types';
import last from 'lodash/last';
import range from 'lodash/range';

export interface ModelizedSectionData {
  flightsPerYear: {
    data: ChartData;
    options: ChartOptions;
  };
  successRates: {
    data: ChartData;
    options: ChartOptions;
  };
}

const buildFlightsPerYearChart = (
  pastLaunches: Launch[],
  upcomingLaunches: Launch[],
) => {
  const yearsStart = 2006; // First Falcon 1 flight
  const sortedUpcomingLaunches = upcomingLaunches.map((launch) =>
    parseInt(launch.launch_year),
  );
  sortedUpcomingLaunches.sort();
  const yearsEnd = last(sortedUpcomingLaunches);
  const years = range(
    yearsStart,
    yearsEnd ? yearsEnd + 1 : new Date().getFullYear(),
  );

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Falcon 1',
        backgroundColor: chartColors.green,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              ({ launch_year, rocket, launch_success }) =>
                parseInt(launch_year) === year &&
                rocket.rocket_id === RocketType.f1 &&
                launch_success,
            ).length,
        ),
      },
      {
        label: 'New Falcon 9',
        backgroundColor: chartColors.blue,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              ({ launch_year, rocket, launch_success }) =>
                parseInt(launch_year) === year &&
                rocket.rocket_id === RocketType.f9 &&
                launch_success &&
                !rocket.first_stage.cores[0].reused,
            ).length,
        ),
      },
      {
        label: 'Used Falcon 9',
        backgroundColor: chartColors.lightblue,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              ({ launch_year, rocket, launch_success }) =>
                parseInt(launch_year) === year &&
                rocket.rocket_id === RocketType.f9 &&
                launch_success &&
                rocket.first_stage.cores[0].reused,
            ).length,
        ),
      },
      {
        label: 'Falcon Heavy',
        backgroundColor: chartColors.yellow,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              ({ launch_year, rocket, launch_success }) =>
                parseInt(launch_year) === year &&
                rocket.rocket_id === RocketType.fh &&
                launch_success,
            ).length,
        ),
      },
      {
        label: 'Failure',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              ({ launch_year, launch_success }) =>
                parseInt(launch_year) === year && !launch_success,
            ).length,
        ),
      },
      {
        label: 'Planned',
        backgroundColor: chartColors.white,
        data: years.map(
          (year) =>
            upcomingLaunches.filter(
              ({ launch_year }) => parseInt(launch_year) === year,
            ).length,
        ),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      mode: 'label',
      callbacks: {
        label: (tooltipItem, data) => {
          if (!data.datasets) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex!];
          return tooltipItem.yLabel
            ? `${dataset.label}: ${tooltipItem.yLabel}`
            : '';
        },
        footer: (tooltipItems) => {
          const totalCount = tooltipItems.reduce(
            (sum, tooltipItem) => sum + (tooltipItem.yLabel as number),
            0,
          );
          return `TOTAL: ${totalCount}`;
        },
      },
    },
  };
  const options: ChartOptions = deepmerge(
    settings.DEFAULTBARCHARTOPTIONS,
    customOptions,
  );
  if (options.scales?.xAxes?.length) {
    options.scales.xAxes[0].stacked = true;
  }
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].stacked = true;
  }

  return { data, options };
};

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

const buildSuccessRateChart = (pastLaunches: Launch[]) => {
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
      mode: 'label',
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

export const modelizer = ({
  pastLaunches,
  upcomingLaunches,
}: SpaceXData): ModelizedSectionData => ({
  flightsPerYear: buildFlightsPerYearChart(pastLaunches, upcomingLaunches),
  successRates: buildSuccessRateChart(pastLaunches),
});
