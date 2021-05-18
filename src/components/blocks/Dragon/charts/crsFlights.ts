import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch, Payload } from 'types';
import { getFlightTime } from './commercialCrewFlights';
import { getPayload } from 'utils/launch';

export const buildCrsFlightsChart = (
  dragonLaunches: Launch[],
  payloads: Payload[],
) => {
  const crsFlights = dragonLaunches.filter((launch) => {
    const payloadName = getPayload(launch, payloads).name;
    return payloadName.includes('COTS') || payloadName.includes('CRS');
  });

  const data = {
    labels: crsFlights.map((launch) => getPayload(launch, payloads).name),
    datasets: [
      {
        label: 'New Dragon 1',
        backgroundColor: chartColors.blue,
        data: crsFlights.map((launch) => {
          const { type, reused } = getPayload(launch, payloads);
          return type.includes('Dragon 1') && !reused
            ? getFlightTime(launch, payloads)
            : 0;
        }),
      },
      {
        label: 'Reused Dragon 1',
        backgroundColor: chartColors.lightblue,
        data: crsFlights.map((launch) => {
          const { type, reused } = getPayload(launch, payloads);
          return type.includes('Dragon 1') && reused
            ? getFlightTime(launch, payloads)
            : 0;
        }),
      },
      {
        label: 'Dragon 2',
        backgroundColor: chartColors.green,
        data: crsFlights.map((launch) => {
          const { type, reused } = getPayload(launch, payloads);
          return type.includes('Dragon 2.0') && reused
            ? getFlightTime(launch, payloads)
            : 0;
        }),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const launch = dragonLaunches.find(
            (launch) =>
              getPayload(launch, payloads).name === tooltipItem.xLabel,
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
            payloads,
          ).toLocaleString()} hours`;
        },
        footer: (tooltipItems) => {
          const currentLaunch = dragonLaunches.find(
            (launch) =>
              getPayload(launch, payloads).name === tooltipItems[0].xLabel,
          )!;
          const currentPayload = getPayload(currentLaunch, payloads);

          if (
            currentPayload.mass_kg === null ||
            currentPayload.dragon.mass_returned_kg === null
          ) {
            return '';
          }

          return `Transported: ${Math.floor(
            currentPayload.mass_kg,
          ).toLocaleString()}kg (up) and ${Math.floor(
            currentPayload.dragon.mass_returned_kg,
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
        crsFlights.reduce(
          (sum, launch) => sum + getFlightTime(launch, payloads) * 3600,
          0,
        ),
      ),
    ),
  };
};
