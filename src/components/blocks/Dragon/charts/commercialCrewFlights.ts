import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Launch } from 'types';

export const getFlightTime = (launch: Launch) =>
  Math.floor(
    (launch.rocket.second_stage.payloads[0].flight_time_sec ??
      new Date().getTime() / 1000 - launch.launch_date_unix) / 3600,
  );

export const buildCommercialCrewFlightsChart = (dragonLaunches: Launch[]) => {
  const crewFlights = dragonLaunches.filter((launch) =>
    launch.rocket.second_stage.payloads[0].payload_type.includes('Crew Dragon'),
  );

  const data = {
    labels: crewFlights.map((launch) => launch.mission_name),
    datasets: [
      {
        label: 'NASA',
        backgroundColor: chartColors.blue,
        data: crewFlights.map((launch) => {
          if (launch.mission_name.includes('Abort')) {
            return 1;
          }
          const { reused } = launch.rocket.second_stage.payloads[0];
          return !reused ? getFlightTime(launch) : 0;
        }),
      },
      {
        label: 'Tourists',
        backgroundColor: chartColors.orange,
        data: crewFlights.map(() => 0),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const launch = dragonLaunches.find(
            (launch) => launch.mission_name === tooltipItem.xLabel,
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
          const flightTime = launch.mission_name.includes('Abort')
            ? '8 minutes 54 seconds'
            : `${getFlightTime(launch).toLocaleString()} hours`;
          return `${dataset.label}: ${flightTime}`;
        },
        footer: (tooltipItems) => {
          const launch = dragonLaunches.find(
            (launch) => launch.mission_name === tooltipItems[0].xLabel,
          );
          if (!launch) {
            return '';
          }
          return `People: 0`;
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
        crewFlights.reduce((sum, launch) => sum + getFlightTime(launch), 0),
      ),
    ),
  };
};
