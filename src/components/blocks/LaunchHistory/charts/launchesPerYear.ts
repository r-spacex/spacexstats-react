import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { RocketType, Launch } from 'types';
import last from 'lodash/last';
import range from 'lodash/range';
import { launchYear } from 'utils/launch';

export const buildLaunchesPerYearChart = (
  pastLaunches: Launch[],
  upcomingLaunches: Launch[],
) => {
  const yearsStart = 2006; // First Falcon 1 flight
  const sortedUpcomingLaunches = upcomingLaunches.map((launch) =>
    launchYear(launch),
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
              (launch) =>
                launchYear(launch) === year &&
                launch.rocket === RocketType.f1 &&
                launch.success,
            ).length,
        ),
      },
      {
        label: 'New Falcon 9',
        backgroundColor: chartColors.blue,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              (launch) =>
                launchYear(launch) === year &&
                launch.rocket === RocketType.f9 &&
                launch.success &&
                !launch.cores[0].reused,
            ).length,
        ),
      },
      {
        label: 'Used Falcon 9',
        backgroundColor: chartColors.lightblue,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              (launch) =>
                launchYear(launch) === year &&
                launch.rocket === RocketType.f9 &&
                launch.success &&
                launch.cores[0].reused,
            ).length,
        ),
      },
      {
        label: 'Falcon Heavy',
        backgroundColor: chartColors.yellow,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              (launch) =>
                launchYear(launch) === year &&
                launch.rocket === RocketType.fh &&
                launch.success,
            ).length,
        ),
      },
      {
        label: 'Failure',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            pastLaunches.filter(
              (launch) => launchYear(launch) === year && !launch.success,
            ).length,
        ),
      },
      {
        label: 'Planned',
        backgroundColor: chartColors.white,
        data: years.map(
          (year) =>
            upcomingLaunches.filter((launch) => launchYear(launch) === year)
              .length,
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
