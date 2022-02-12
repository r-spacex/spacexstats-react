import settings from 'settings';
import { chartColors } from 'stylesheet';
import { LandingType, Launch, LaunchCore, LandpadType } from 'types';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import last from 'lodash/last';
import range from 'lodash/range';
import { launchYear } from 'utils/launch';

interface LandingAttempt {
  launch: Launch;
  core: LaunchCore;
}

export const buildLandingHistoryChart = (pastLaunches: Launch[]) => {
  const landingAttempts: LandingAttempt[] = [];
  pastLaunches.forEach((launch) => {
    if (!launch.success) {
      return;
    }
    launch.cores.forEach((core) => {
      if (core.landing_type === null) {
        return;
      }
      landingAttempts.push({
        launch,
        core,
      });
    });
  });

  const yearsStart = launchYear(landingAttempts[0].launch);
  const yearsEnd = launchYear(last(landingAttempts)!.launch);
  const years = range(yearsStart, yearsEnd + 1);

  const successfulLandings = landingAttempts.filter(
    ({ core }) => core.landing_success,
  );
  const failures = landingAttempts.filter(({ core }) => !core.landing_success);

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Ocean',
        backgroundColor: chartColors.yellow,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launchYear(launch) === year &&
                core.landing_type === LandingType.ocean,
            ).length,
        ),
      },
      {
        label: 'RTLS',
        backgroundColor: chartColors.green,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launchYear(launch) === year &&
                core.landing_type === LandingType.rtls,
            ).length,
        ),
      },
      {
        label: 'ASDS - OCISLY',
        backgroundColor: chartColors.white,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launchYear(launch) === year &&
                core.landpad === LandpadType.ocisly,
            ).length,
        ),
      },
      {
        label: 'ASDS - JRTI',
        backgroundColor: chartColors.lightblue,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launchYear(launch) === year &&
                (core.landpad === LandpadType.jrti ||
                  core.landpad === LandpadType.jrtiv1),
            ).length,
        ),
      },
      {
        label: 'ASDS - ASOG',
        backgroundColor: chartColors.blue,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launchYear(launch) === year &&
                core.landpad === LandpadType.asog,
            ).length,
        ),
      },
      {
        label: 'Failures',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            failures.filter(({ launch }) => launchYear(launch) === year).length,
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
            ({ launch }) => launchYear(launch) === tooltipItems[0].xLabel,
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
  }

  return { data, options };
};
