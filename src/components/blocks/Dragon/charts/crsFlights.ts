import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch } from 'types';
import { getFlightTime } from './commercialCrewFlights';

export const buildCrsFlightsChart = (dragonLaunches: Launch[]) => {
  const crsFlights = dragonLaunches.filter(
    (launch) =>
      launch.rocket.second_stage.payloads[0].payload_id.includes('COTS') ||
      launch.rocket.second_stage.payloads[0].payload_id.includes('CRS'),
  );

  const data = {
    labels: crsFlights.map(
      (launch) => launch.rocket.second_stage.payloads[0].payload_id,
    ),
    datasets: [
      {
        label: 'New Dragon 1',
        backgroundColor: chartColors.blue,
        data: crsFlights.map((launch) => {
          const {
            payload_type,
            reused,
          } = launch.rocket.second_stage.payloads[0];
          return payload_type.includes('Dragon 1') && !reused
            ? getFlightTime(launch)
            : 0;
        }),
      },
      {
        label: 'Reused Dragon 1',
        backgroundColor: chartColors.lightblue,
        data: crsFlights.map((launch) => {
          const {
            payload_type,
            reused,
          } = launch.rocket.second_stage.payloads[0];
          return payload_type.includes('Dragon 1') && reused
            ? getFlightTime(launch)
            : 0;
        }),
      },
      {
        label: 'Dragon 2',
        backgroundColor: chartColors.green,
        data: crsFlights.map(() => 0),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const launch = dragonLaunches.find(
            (launch) =>
              launch.rocket.second_stage.payloads[0].payload_id ===
              tooltipItem.xLabel,
          )!;
          if (
            tooltipItem.datasetIndex === undefined ||
            !data.datasets[tooltipItem.datasetIndex]
          ) {
            return '';
          }
          if (!tooltipItem.yLabel) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex];
          return `${dataset.label}: ${getFlightTime(
            launch,
          ).toLocaleString()} hours`;
        },
        footer: (tooltipItems) => {
          const {
            rocket: {
              second_stage: { payloads },
            },
          } = dragonLaunches.find(
            (launch) =>
              launch.rocket.second_stage.payloads[0].payload_id ===
              tooltipItems[0].xLabel,
          )!;

          return `Transported: ${Math.floor(
            payloads[0].payload_mass_kg,
          ).toLocaleString()}kg (Up) and ${Math.floor(
            payloads[0].mass_returned_kg,
          ).toLocaleString()}kg (down)`;
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.xAxes?.length) {
    options.scales.xAxes[0].stacked = true;
  }
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].stacked = true;
    options.scales.yAxes[0].ticks.callback = (label) =>
      `${Math.ceil(Number(label)).toLocaleString()} hours`;
  }

  return {
    data,
    options,
    totalFlightTime: formatDuration(
      Math.floor(
        crsFlights.reduce((sum, launch) => sum + getFlightTime(launch), 0),
      ),
    ),
  };
};
