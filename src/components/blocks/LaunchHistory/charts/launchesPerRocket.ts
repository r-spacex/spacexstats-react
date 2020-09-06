import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { RocketType, Launch } from 'types';

export const buildLaunchesPerRocketChart = (pastLaunches: Launch[]) => {
  const launchesPerRocket = {
    'Falcon 1': pastLaunches.filter(({ rocket }) => rocket === RocketType.f1)
      .length,
    'Falcon 9': pastLaunches.filter(({ rocket }) => rocket === RocketType.f9)
      .length,
    'Falcon Heavy': pastLaunches.filter(
      ({ rocket }) => rocket === RocketType.fh,
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

  const customOptions: ChartOptions = {};
  const options = deepmerge(settings.DEFAULTCHARTOPTIONS, customOptions);

  return { data, options };
};
