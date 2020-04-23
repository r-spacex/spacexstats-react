import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXData, Launch } from 'types';
import { fromUnix } from 'utils/date';
import endOfMonth from 'date-fns/endOfMonth';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import { chartColors } from 'stylesheet';
import settings from 'settings';
import format from 'date-fns/format';

export interface ModelizedSectionData {
  inSpace: {
    data: ChartData;
    options: ChartOptions;
  };
  launchRate: {
    data: ChartData;
    options: ChartOptions;
  };
  deorbited: number;
}

const MONTH_FORMAT = 'MM-yyyy';
export const buildInSpaceChart = (starlinkLaunches: Launch[]) => {
  const start = fromUnix(starlinkLaunches[0].launch_date_unix);
  const months = eachMonthOfInterval({ start, end: new Date() });

  const data = {
    labels: months.map((month) => format(month, MONTH_FORMAT)),
    datasets: [
      {
        label: 'In Space',
        type: 'line',
        data: months.map(
          (month) =>
            starlinkLaunches.filter(
              (launch) =>
                fromUnix(launch.launch_date_unix).getTime() <
                endOfMonth(month).getTime(),
            ).length * 60,
        ),
        lineTension: 0,
        fill: false,
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blue,
      },
      {
        label: 'US and Canada coverage',
        type: 'line',
        data: months.map(() => 720),
        lineTension: 0,
        fill: false,
        borderColor: chartColors.red,
        pointRadius: 0,
      },
      {
        label: 'Global coverage',
        type: 'line',
        data: months.map(() => 1440),
        lineTension: 0,
        fill: false,
        borderColor: chartColors.yellow,
        pointRadius: 0,
      },
      {
        label: 'Constellation complete',
        type: 'line',
        data: months.map(() => 4400),
        lineTension: 0,
        fill: false,
        borderColor: chartColors.green,
        pointRadius: 0,
      },
      {
        label: 'Extended constellation',
        type: 'line',
        data: months.map(() => 12000),
        lineTension: 0,
        fill: false,
        borderColor: chartColors.white,
        pointRadius: 0,
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = data.datasets[tooltipItem.datasetIndex!];
          return tooltipItem.yLabel
            ? `${dataset.label}: ${tooltipItem.yLabel as number} sats`
            : '';
        },
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);

  return { data, options };
};

export const buildLaunchRateChart = (starlinkLaunches: Launch[]) => {
  const start = fromUnix(starlinkLaunches[0].launch_date_unix);
  const months = eachMonthOfInterval({ start, end: new Date() });

  const data = {
    labels: months.map((month) => format(month, MONTH_FORMAT)),
    datasets: [
      {
        label: 'Falcon 9',
        data: months.map(
          (month) =>
            starlinkLaunches.filter(
              (launch) =>
                format(fromUnix(launch.launch_date_unix), MONTH_FORMAT) ===
                format(month, MONTH_FORMAT),
            ).length * 60,
        ),
        backgroundColor: chartColors.blue,
      },
      {
        label: 'Starship',
        data: months.map(() => 0),
        backgroundColor: chartColors.white,
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = data.datasets[tooltipItem.datasetIndex!];
          return tooltipItem.yLabel
            ? `${dataset.label}: ${tooltipItem.yLabel as number} sats`
            : '';
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
  }

  return { data, options };
};

export const modelizer = ({ pastLaunches }: SpaceXData) => {
  const starlinkLaunches = pastLaunches.filter((launch) =>
    launch.rocket.second_stage.payloads.some((payload) =>
      payload.payload_id.includes('Starlink'),
    ),
  );

  return {
    inSpace: buildInSpaceChart(starlinkLaunches),
    launchRate: buildLaunchRateChart(starlinkLaunches),
    deorbited: 3,
  };
};

export default modelizer;
