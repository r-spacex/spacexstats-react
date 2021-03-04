import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';
import { SpaceXData, Starlink } from 'types';
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

const FIRST_STARLINK_LAUNCH = new Date('2019-05-24');
const MONTH_FORMAT = 'MM-yyyy';
export const buildInSpaceChart = (starlinks: Starlink[]) => {
  const months = eachMonthOfInterval({
    start: FIRST_STARLINK_LAUNCH,
    end: new Date(),
  });

  const data = {
    labels: months.map((month) => format(month, MONTH_FORMAT)),
    datasets: [
      {
        label: 'In Space',
        type: 'line',
        data: months.map(
          (month) =>
            starlinks.filter(
              ({ spaceTrack: { LAUNCH_DATE } }) =>
                new Date(LAUNCH_DATE).getTime() < endOfMonth(month).getTime(),
            ).length -
            starlinks.filter(
              ({ spaceTrack: { DECAY_DATE } }) =>
                DECAY_DATE &&
                new Date(DECAY_DATE).getTime() < endOfMonth(month).getTime(),
            ).length,
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
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].ticks.callback = (label) => `${label} sats`;
  }

  return { data, options };
};

export const buildLaunchRateChart = (starlinks: Starlink[]) => {
  const months = eachMonthOfInterval({
    start: FIRST_STARLINK_LAUNCH,
    end: new Date(),
  });

  const data = {
    labels: months.map((month) => format(month, MONTH_FORMAT)),
    datasets: [
      {
        label: 'Falcon 9',
        data: months.map(
          (month) =>
            starlinks.filter(
              ({ spaceTrack: { LAUNCH_DATE } }) =>
                format(new Date(LAUNCH_DATE), MONTH_FORMAT) ===
                format(month, MONTH_FORMAT),
            ).length,
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
    options.scales.yAxes[0].ticks.callback = (label) => `${label} sats`;
  }

  return { data, options };
};

export const modelizer = ({ starlink }: SpaceXData) => ({
  inSpace: buildInSpaceChart(starlink),
  launchRate: buildLaunchRateChart(starlink),
  deorbited: starlink.filter(
    ({ spaceTrack: { DECAY_DATE } }) => DECAY_DATE !== null,
  ).length,
});

export default modelizer;
