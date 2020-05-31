import { SpaceXData } from 'types';

export interface ModelizedSectionData {
  dragonriders: number;
  moonPopulation: number;
  marsPopulation: number;
  employees: number;
}

export const modelizer = (_: SpaceXData): ModelizedSectionData => ({
  dragonriders: 2,
  moonPopulation: 0,
  marsPopulation: 0,
  employees: 7000,
});
