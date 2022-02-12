import settings from 'settings';
import { chartColors } from 'stylesheet';
import { Launch } from 'types';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import last from 'lodash/last';
import range from 'lodash/range';
import { launchYear } from 'utils/launch';

export const buildFairingsRecoveryChart = (pastLaunches: Launch[]) => {
  const recoveryAttempts = pastLaunches.filter(
    (launch) => launch.fairings?.recovery_attempt,
  );

  const yearsStart = launchYear(recoveryAttempts[0]);
  const yearsEnd = launchYear(last(recoveryAttempts)!);
  const years = range(yearsStart, yearsEnd + 1);

  const failures = recoveryAttempts.filter(
    (launch) => !launch.fairings?.recovered,
  );

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Success',
        backgroundColor: chartColors.blue,
        data: years.map(
          (year) =>
            recoveryAttempts.filter(
              (launch) =>
                launchYear(launch) === year && launch.fairings?.recovered,
            ).length,
        ),
      },
      {
        label: 'Failure',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            failures.filter((launch) => launchYear(launch) === year).length,
        ),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
      mode: 'label',
      callbacks: {
        label: (tooltipItem, data) => {
          if (!data.datasets) {
            return '';
          }
          const dataset = data.datasets[tooltipItem.datasetIndex!];
          return tooltipItem.yLabel
            ? `${dataset.label}: ${tooltipItem.yLabel}`
            : '';
        },
        footer: (tooltipItems) => {
          const totalCount = tooltipItems.reduce(
            (sum, tooltipItem) => sum + (tooltipItem.yLabel as number),
            0,
          );
          const failuresCount = failures.filter(
            (launch) => launchYear(launch) === tooltipItems[0].xLabel,
          ).length;
          const rate = (100 * (totalCount - failuresCount)) / totalCount;
          return `TOTAL: ${totalCount} (${rate.toFixed(0)}% success rate)`;
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
    options.scales.yAxes[0].ticks.stepSize = 1;
  }

  return { data, options };
};
