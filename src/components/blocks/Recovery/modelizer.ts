import settings from 'settings';
import { chartColors } from 'stylesheet';
import {
  SpaceXData,
  LandingType,
  Launch,
  LaunchCore,
  Landpad,
  LandpadType,
} from 'types';
import { ChartData, ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { launchYear, getPayloads } from 'utils/launch';

export interface ModelizedSectionData {
  landedBoostersCount: number;
  landingHistory: {
    data: ChartData;
    options: ChartOptions;
  };
  heaviestLanding: {
    mass: number;
    mission: string;
    landingType: string;
  };
  fairingsRecovery: {
    data: ChartData;
    options: ChartOptions;
  };
}

const formatLandingType = (landingType: LandingType, landpad: Landpad) => {
  if (landingType === LandingType.ocean) {
    return 'an ocean landing';
  }

  if (landingType === LandingType.rtls) {
    return 'an RTLS landing';
  }

  if (landingType !== LandingType.asds) {
    return 'Unexpected landing type!';
  }

  return `an ASDS landing on ${landpad.name}`;
};

interface LandingAttempt {
  launch: Launch;
  core: LaunchCore;
}

const buildLandingHistoryChart = (pastLaunches: Launch[]) => {
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

const buildFairingsRecoveryChart = (pastLaunches: Launch[]) => {
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

export const modelizer = ({
  pastLaunches,
  payloads,
  landpads,
}: SpaceXData): ModelizedSectionData => {
  const landedBoostersCount = pastLaunches.reduce(
    (sum, launch) =>
      sum +
      launch.cores.filter(
        (core) =>
          core.landing_success &&
          (core.landing_type === LandingType.rtls ||
            core.landing_type === LandingType.asds),
      ).length,
    0,
  );

  const landingMasses = pastLaunches.map((launch) => ({
    mass: getPayloads(launch, payloads).reduce(
      (sum, payload) => (sum += payload.mass_kg ?? 0),
      0,
    ),
    mission: launch.name,
    landingType: formatLandingType(
      launch.cores[0].landing_type,
      landpads.find((landpad) => landpad.id === launch.cores[0].landpad)!,
    ),
  }));
  const sortedLandingMasses = orderBy(landingMasses, 'mass', 'desc');

  return {
    landedBoostersCount,
    landingHistory: buildLandingHistoryChart(pastLaunches),
    heaviestLanding: sortedLandingMasses[0],
    fairingsRecovery: buildFairingsRecoveryChart(pastLaunches),
  };
};
