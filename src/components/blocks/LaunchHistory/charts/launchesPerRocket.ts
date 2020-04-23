import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { RocketType, Launch } from 'types';
import groupBy from 'lodash/groupBy';

export const buildLaunchesPerRocketChart = (pastLaunches: Launch[]) => {
  const launchesPerRocket = {
    'Falcon 1': pastLaunches.filter(
      ({ rocket }) => rocket.rocket_id === RocketType.f1,
    ).length,
    'Falcon 9': pastLaunches.filter(
      ({ rocket }) => rocket.rocket_id === RocketType.f9,
    ).length,
    'Falcon Heavy': pastLaunches.filter(
      ({ rocket }) => rocket.rocket_id === RocketType.fh,
    ).length,
    Starship: 0,
  };

  const data = {
    labels: Object.keys(launchesPerRocket),
    datasets: [
      {
        data: Object.values(launchesPerRocket),
        backgroundColor: [
          chartColors.green,
          chartColors.blue,
          chartColors.yellow,
          chartColors.grey,
        ],
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        afterLabel: (tooltipItem) => {
          if (
            tooltipItem.index &&
            data.labels[tooltipItem.index] === 'Falcon 9'
          ) {
            const falcon9Launches = pastLaunches.filter(
              ({ rocket }) => rocket.rocket_id === RocketType.f9,
            );
            const versions = groupBy(
              falcon9Launches,
              (launch) => launch.rocket.rocket_type,
            );
            return `(${Object.keys(versions)
              .map((version) => `${versions[version].length} ${version}`)
              .join(', ')})`;
          }
          return '';
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTCHARTOPTIONS, customOptions);

  return { data, options };
};
