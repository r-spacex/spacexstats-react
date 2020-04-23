import settings from 'settings';
import { chartColors } from 'stylesheet';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch } from 'types';

export const buildMissionTypesChart = (dragonLaunches: Launch[]) => {
  const missions = {
    CRS: dragonLaunches.filter(
      (launch) =>
        launch.rocket.second_stage.payloads[0].payload_id.includes('COTS') ||
        launch.rocket.second_stage.payloads[0].payload_id.includes('CRS'),
    ).length,
    Crew: dragonLaunches.filter(
      (launch) =>
        launch.rocket.second_stage.payloads[0].payload_type === 'Crew Dragon',
    ).length,
    DragonXL: 0,
  };

  const data = {
    labels: Object.keys(missions),
    datasets: [
      {
        data: Object.values(missions),
        backgroundColor: [
          chartColors.blue,
          chartColors.yellow,
          chartColors.white,
        ],
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          if (
            tooltipItem.index === undefined ||
            !Object.keys(missions)[tooltipItem.index]
          ) {
            return ``;
          }
          const missionType = Object.keys(missions)[tooltipItem.index];
          const launchCount = Object.values(missions)[tooltipItem.index];

          return `${missionType}: ${launchCount} missions`;
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTCHARTOPTIONS, customOptions);

  return { data, options, totalFlights: dragonLaunches.length };
};
