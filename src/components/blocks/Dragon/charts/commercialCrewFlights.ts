import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Crew, Launch } from 'types';
import { getPayload } from 'utils/launch';

// The flight time reported for the payload is the only record of how long a
// Dragon was up. When it is missing the mission length is simply unknown, so
// this returns null rather than guessing.
//
// What stood here instead fell back to the time elapsed since launch, which is
// only meaningful while a capsule is still in orbit. Nothing on a past launch
// says whether its capsule has come home, so for a mission that has already
// splashed down the figure grew without bound: CRS-23 was reported as 2,810
// hours two months after it returned, because that is how long ago it had
// launched (#87). The fallback had also stopped being self-consistent -
// `getTime()` is in milliseconds, while the `date_unix` it replaced was in
// seconds - so by now it produced large negative numbers.
export const getFlightTime = (launch: Launch): number | null => {
  const flightTimeInSeconds = getPayload(launch)?.dragon.flightTime;

  if (flightTimeInSeconds === null || flightTimeInSeconds === undefined) {
    return null;
  }

  return Math.floor(flightTimeInSeconds / 3600);
};

export const buildCommercialCrewFlightsChart = (
  dragonLaunches: Launch[],
  crew: Crew[],
) => {
  const crewFlights = dragonLaunches.filter((launch) =>
    getPayload(launch)?.type.includes('Crew Dragon'),
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
          return getPayload(launch)?.customers[0].includes('NASA')
            ? getFlightTime(launch) ?? 0
            : 0;
        }),
      },
      {
        label: 'Tourists',
        backgroundColor: chartColors.orange,
        data: crewFlights.map((launch) =>
          !getPayload(launch)?.customers[0].includes('NASA')
            ? getFlightTime(launch) ?? 0
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
          const hours = getFlightTime(launch);
          const flightTime = launch.name.includes('Abort')
            ? '8 minutes 54 seconds'
            : hours === null
            ? 'unknown flight time'
            : `${hours.toLocaleString()} hours`;
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
          (sum, launch) => sum + (getFlightTime(launch) ?? 0) * 3600,
          0,
        ),
      ),
    ),
  };
};
