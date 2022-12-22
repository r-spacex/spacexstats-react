import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch } from 'types';
import { getFlightTime } from './commercialCrewFlights';
import { getPayload } from 'utils/launch';

export const buildCrsFlightsChart = (dragonLaunches: Launch[]) => {
  const crsFlights = dragonLaunches.filter((launch) => {
    const payloadName = getPayload(launch)?.name;
    return payloadName?.includes('COTS') || payloadName?.includes('CRS');
  });

  const data = {
    labels: crsFlights.map(
      (launch) => getPayload(launch)?.name ?? 'Unknown mission',
    ),
    datasets: [
      {
        label: 'New Dragon 1',
        backgroundColor: chartColors.blue,
        data: crsFlights.map((launch) => {
          const payload = getPayload(launch);
          return payload?.type.includes('Dragon 1') && !payload?.reused
            ? getFlightTime(launch)
            : 0;
        }),
      },
      {
        label: 'Reused Dragon 1',
        backgroundColor: chartColors.lightblue,
        data: crsFlights.map((launch) => {
          const payload = getPayload(launch);
          return payload?.type.includes('Dragon 1') && payload?.reused
            ? getFlightTime(launch)
            : 0;
        }),
      },
      {
        label: 'New Dragon 2',
        backgroundColor: chartColors.white,
        data: crsFlights.map((launch) => {
          const payload = getPayload(launch);
          return payload?.type.includes('Dragon 2.0') && !payload?.reused
            ? getFlightTime(launch)
            : 0;
        }),
      },
      {
        label: 'Reused Dragon 2',
        backgroundColor: chartColors.green,
        data: crsFlights.map((launch) => {
          const payload = getPayload(launch);
          return payload?.type.includes('Dragon 2.0') && payload?.reused
            ? getFlightTime(launch)
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
            (launch) => getPayload(launch)?.name === tooltipItem.xLabel,
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
          const currentLaunch = dragonLaunches.find(
            (launch) => getPayload(launch)?.name === tooltipItems[0].xLabel,
          )!;
          const currentPayload = getPayload(currentLaunch);

          if (
            currentPayload?.mass === null ||
            currentPayload?.dragon.massReturned === null
          ) {
            return '';
          }

          return `Transported: ${Math.floor(
            currentPayload?.mass ?? 0,
          ).toLocaleString()}kg (up) and ${Math.floor(
            currentPayload?.dragon.massReturned ?? 0,
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
          (sum, launch) => sum + getFlightTime(launch) * 3600,
          0,
        ),
      ),
    ),
  };
};
