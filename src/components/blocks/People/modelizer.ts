import { SpaceXStatsData, Roadster } from 'types';

export interface ModelizedSectionData {
  dragonriders: number;
  moonPopulation: number;
  marsPopulation: number;
  employees: number;
  starman: Roadster;
}

export const modelizer = ({
  company,
  crew,
  roadster,
}: SpaceXStatsData): ModelizedSectionData => ({
  dragonriders: crew.reduce(
    (sum, currentCrew) => sum + currentCrew.launches.length,
    0,
  ),
  moonPopulation: 0,
  marsPopulation: 0,
  employees: company.employees,
  starman: roadster,
});
