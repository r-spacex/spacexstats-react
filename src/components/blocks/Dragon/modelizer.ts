import { ChartOptions, ChartData } from 'chart.js';
import { SpaceXStatsData } from 'types';
import { buildMissionTypesChart } from './charts/missionTypes';
import { buildCrsFlightsChart } from './charts/crsFlights';
import { buildCommercialCrewFlightsChart } from './charts/commercialCrewFlights';
import { getPayload } from 'utils/launch';

export interface ModelizedSectionData {
  missions: {
    data: ChartData;
    options: ChartOptions;
    totalFlights: number;
  };
  crsFlights: {
    data: ChartData;
    options: ChartOptions;
    totalFlightTime: string;
  };
  commercialCrewFlights: {
    data: ChartData;
    options: ChartOptions;
  };
}

export const modelizer = ({
  pastLaunches,
  payloads,
  crew,
}: SpaceXStatsData): ModelizedSectionData => {
  const exclusionList = ['Dragon Qualification Unit'];
  const dragonLaunches = pastLaunches.filter((launch) => {
    const payload = getPayload(launch, payloads);
    return (
      payload?.type.includes('Dragon') && !exclusionList.includes(payload.type)
    );
  });

  return {
    missions: buildMissionTypesChart(dragonLaunches, payloads),
    crsFlights: buildCrsFlightsChart(dragonLaunches, payloads),
    commercialCrewFlights: buildCommercialCrewFlightsChart(
      dragonLaunches,
      payloads,
      crew,
    ),
  };
};
