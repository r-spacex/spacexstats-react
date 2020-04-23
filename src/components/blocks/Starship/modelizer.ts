import { SpaceXData } from 'types';
import settings from 'settings';
import { format } from 'date-fns';
import { chartColors } from 'stylesheet';
import { ChartOptions, ChartData } from 'chart.js';
import deepmerge from 'deepmerge';

export interface ModelizedSectionData {
  starshipHops: {
    data: ChartData;
    options: ChartOptions;
  };
}

interface Hop {
  date: Date | null;
  height: number;
  tentative?: boolean;
}
const hops: Hop[] = [
  { date: new Date('2019-07-25'), height: 20 },
  { date: new Date('2019-08-27'), height: 150 },
  { date: null, height: 150, tentative: true },
];

const buildStarshipHopsChart = () => {
  const data = {
    labels: hops.map((hop) =>
      hop.date ? format(hop.date, 'MMM do yyyy') : 'Next tentative',
    ),
    datasets: [
      {
        label: 'Past hops',
        backgroundColor: chartColors.blue,
        data: hops.map((hop) => (!hop.tentative ? hop.height : null)),
      },
      {
        label: 'Future hops',
        backgroundColor: chartColors.white,
        data: hops.map((hop) => (hop.tentative ? hop.height : null)),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem) =>
          tooltipItem.value && parseInt(tooltipItem.value) > 0
            ? `Height: ${parseInt(tooltipItem.value).toLocaleString()}m`
            : '',
      },
    },
  };
  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.xAxes?.length) {
    options.scales.xAxes[0].stacked = true;
  }
  if (options.scales?.yAxes?.length) {
    options.scales.yAxes[0].type = 'logarithmic';
  }

  return { data, options };
};

export const modelizer = (_: SpaceXData): ModelizedSectionData => ({
  starshipHops: buildStarshipHopsChart(),
});
