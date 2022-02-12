import { SpaceXData, LandingType, Landpad } from 'types';
import { ChartData, ChartOptions } from 'chart.js';
import orderBy from 'lodash/orderBy';
import { getPayloads } from 'utils/launch';
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
