import settings from 'settings';
import { chartColors } from 'stylesheet';
import {
  SpaceXData,
  LandingType,
  LandingVehicle,
  Launch,
  LaunchCore,
} from 'types';
import { ChartData, ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';

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

const formatLandingType = (
  landingType: LandingType,
  landingVehicle: LandingVehicle,
) => {
  if (landingType === LandingType.ocean) {
    return 'an ocean landing';
  }

  if (landingType === LandingType.rtls) {
    return 'an RTLS landing';
  }

  if (landingType !== LandingType.asds) {
    return 'Unexpected landing type!';
  }

  return `an ASDS landing on ${landingVehicle}`;
};

interface LandingAttempt {
  launch: Launch;
  core: LaunchCore;
}

const buildLandingHistoryChart = (pastLaunches: Launch[]) => {
  const landingAttempts: LandingAttempt[] = [];
  pastLaunches.forEach((launch) => {
    if (!launch.launch_success) {
      return;
    }
    launch.rocket.first_stage.cores.forEach((core) => {
      if (core.landing_type === null) {
        return;
      }
      landingAttempts.push({
        launch,
        core,
      });
    });
  });

  const yearsStart = parseInt(landingAttempts[0].launch.launch_year);
  const yearsEnd = parseInt(last(landingAttempts)!.launch.launch_year);
  const years = range(yearsStart, yearsEnd + 1).map((year) => String(year));

  const successfulLandings = landingAttempts.filter(
    ({ core }) => core.land_success,
  );
  const failures = landingAttempts.filter(({ core }) => !core.land_success);

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Ocean',
        backgroundColor: chartColors.blue,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launch.launch_year === year &&
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
                launch.launch_year === year &&
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
                launch.launch_year === year &&
                core.landing_vehicle === LandingVehicle.ocisly,
            ).length,
        ),
      },
      {
        label: 'ASDS - JRTI',
        backgroundColor: chartColors.yellow,
        data: years.map(
          (year) =>
            successfulLandings.filter(
              ({ launch, core }) =>
                launch.launch_year === year &&
                core.landing_vehicle === LandingVehicle.jrti,
            ).length,
        ),
      },
      {
        label: 'Failures',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            failures.filter(({ launch }) => launch.launch_year === year).length,
        ),
      },
    ],
  };

  const customOptions: ChartOptions = {
    tooltips: {
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
            ({ launch }) => launch.launch_year === tooltipItems[0].xLabel,
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
    (launch) =>
      launch.rocket.fairings && launch.rocket.fairings.recovery_attempt,
  );

  const yearsStart = parseInt(recoveryAttempts[0].launch_year);
  const yearsEnd = parseInt(last(recoveryAttempts)!.launch_year);
  const years = range(yearsStart, yearsEnd + 1).map((year) => String(year));

  const failures = recoveryAttempts.filter(
    (launch) => !launch.rocket.fairings?.recovered,
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
                launch.launch_year === year &&
                launch.rocket.fairings?.recovered,
            ).length,
        ),
      },
      {
        label: 'Failure',
        backgroundColor: chartColors.red,
        data: years.map(
          (year) =>
            failures.filter((launch) => launch.launch_year === year).length,
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
            (launch) => launch.launch_year === tooltipItems[0].xLabel,
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
}: SpaceXData): ModelizedSectionData => {
  const landedBoostersCount = pastLaunches.reduce(
    (sum, launch) =>
      sum +
      launch.rocket.first_stage.cores.filter(
        (core) =>
          core.land_success &&
          (core.landing_type === LandingType.rtls ||
            core.landing_type === LandingType.asds),
      ).length,
    0,
  );

  const landingMasses = pastLaunches.map((launch) => ({
    mass: launch.rocket.second_stage.payloads.reduce(
      (sum, payload) => (sum += payload.payload_mass_kg),
      0,
    ),
    mission: launch.mission_name,
    landingType: formatLandingType(
      launch.rocket.first_stage.cores[0].landing_type,
      launch.rocket.first_stage.cores[0].landing_vehicle,
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
