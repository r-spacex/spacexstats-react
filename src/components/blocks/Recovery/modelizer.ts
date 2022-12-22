import {
  SpaceXStatsData,
  CoreLaunch,
  Landpad,
  isLandpadRTLS,
  isLandpadASDS,
} from 'types';
import { ChartData, ChartOptions } from 'chart.js';
import orderBy from 'lodash/orderBy';
import { buildLandingHistoryChart } from './charts/landingHistory';
import { buildFairingsRecoveryChart } from './charts/fairingsRecovery';

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

const formatLandingType = (coreLaunch: CoreLaunch) => {
  if (coreLaunch.landing === Landpad.ocean) {
    return 'an ocean landing';
  }

  if (isLandpadRTLS(coreLaunch.landing)) {
    return 'an RTLS landing';
  }

  return `an ASDS landing on ${coreLaunch.landing}`;
};

export const modelizer = ({
  pastLaunches,
}: SpaceXStatsData): ModelizedSectionData => {
  const landedBoostersCount = pastLaunches.reduce(
    (sum, launch) =>
      sum +
      launch.cores.filter(
        (core) =>
          core.landingSuccess &&
          (isLandpadRTLS(core.landing) || isLandpadASDS(core.landing)),
      ).length,
    0,
  );

  const landingMasses = pastLaunches.map((launch) => ({
    mass: launch.payloads.reduce(
      (sum, payload) => (sum += payload.mass ?? 0),
      0,
    ),
    mission: launch.name,
    landingType: formatLandingType(launch.cores[0]),
  }));
  const sortedLandingMasses = orderBy(landingMasses, 'mass', 'desc');

  return {
    landedBoostersCount,
    landingHistory: buildLandingHistoryChart(pastLaunches),
    heaviestLanding: sortedLandingMasses[0],
    fairingsRecovery: buildFairingsRecoveryChart(pastLaunches),
  };
};
