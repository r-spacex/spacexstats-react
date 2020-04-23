import { ChartOptions, ChartData } from 'chart.js';
import { SpaceXData } from 'types';
import { buildMissionTypesChart } from './charts/missionTypes';
import { buildCrsFlightsChart } from './charts/crsFlights';
import { buildCommercialCrewFlightsChart } from './charts/commercialCrewFlights';

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
}: SpaceXData): ModelizedSectionData => {
  const exclusionList = ['Dragon Qualification Unit'];
  const dragonLaunches = pastLaunches.filter(
    (launch) =>
      launch.rocket.second_stage.payloads[0].payload_type.indexOf('Dragon') !==
        -1 &&
      !exclusionList.includes(
        launch.rocket.second_stage.payloads[0].payload_id,
      ),
  );

  return {
    missions: buildMissionTypesChart(dragonLaunches),
    crsFlights: buildCrsFlightsChart(dragonLaunches),
    commercialCrewFlights: buildCommercialCrewFlightsChart(dragonLaunches),
  };
};
