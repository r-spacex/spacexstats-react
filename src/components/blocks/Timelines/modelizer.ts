import { SpaceXStatsData } from 'types';

export interface ModelizedSectionData {
  elonMuskBet: Date;
  gwynneShotwellBet: Date;
  foundingDate: Date;
}

export const modelizer = (_: SpaceXStatsData): ModelizedSectionData => ({
  elonMuskBet: new Date('2026-01-01'),
  gwynneShotwellBet: new Date('2029-01-01'),
  foundingDate: new Date('2002-03-14'),
});
