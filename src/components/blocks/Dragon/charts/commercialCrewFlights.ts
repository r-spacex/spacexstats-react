import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Crew, Launch, Payload } from 'types';
import { getPayload } from 'utils/launch';

export const getFlightTime = (launch: Launch, payloads: Payload[]) =>
  Math.floor(
    (getPayload(launch, payloads)?.dragon.flight_time_sec ??
      new Date().getTime() / 1000 - launch.date_unix) / 3600,
  );

export const buildCommercialCrewFlightsChart = (
  dragonLaunches: Launch[],
  payloads: Payload[],
  crew: Crew[],
) => {
  console.log({
    dragonLaunches,
    payload: [
      getPayload(dragonLaunches[30], payloads),
      getPayload(dragonLaunches[33], payloads),
      getPayload(dragonLaunches[34], payloads),
    ],
  });
  const crewFlights = dragonLaunches.filter((launch) =>
    getPayload(launch, payloads)?.type.includes('Crew Dragon'),
  );

  const data = {
    labels: crewFlights.map((launch) => launch.name),
    datasets: [
      {
        label: 'NASA',
        backgroundColor: chartColors.blue,
        data: crewFlights.map((launch) => {
          if (launch.name.includes('Abort')) {
            return 1;
          }
          return getPayload(launch, payloads)?.customers[0].includes('NASA')
            ? getFlightTime(launch, payloads)
            : 0;
        }),
      },
      {
        label: 'Tourists',
        backgroundColor: chartColors.orange,
        data: crewFlights.map((launch) =>
          !getPayload(launch, payloads)?.customers[0].includes('NASA')
            ? getFlightTime(launch, payloads)
            : 0,
        ),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const launch = dragonLaunches.find(
            (launch) => launch.name === tooltipItem.xLabel,
          );
          if (!launch || tooltipItem.yLabel === 0) {
            return '';
          }
          if (
            tooltipItem.datasetIndex === undefined ||
            !data.datasets[tooltipItem.datasetIndex]
          ) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const flightTime = launch.name.includes('Abort')
            ? '8 minutes 54 seconds'
            : `${getFlightTime(launch, payloads).toLocaleString()} hours`;
          return `${dataset.label}: ${flightTime}`;
        },
        footer: (tooltipItems) => {
          const launch = dragonLaunches.find(
            (launch) => launch.name === tooltipItems[0].xLabel,
          );
          if (!launch) {
            return '';
          }

          const crewCount = crew.filter((person) =>
            person.launches.includes(launch.id),
          ).length;

          return `People: ${crewCount}`;
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
        crewFlights.reduce(
          (sum, launch) => sum + getFlightTime(launch, payloads),
          0,
        ),
      ),
    ),
  };
};
