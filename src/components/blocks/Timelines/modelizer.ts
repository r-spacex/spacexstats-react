import { SpaceXData } from 'types';

export interface ModelizedSectionData {
  elonMuskBet: Date;
  gwynneShotwellBet: Date;
  foundingDate: Date;
  gwynneShotwellMarsBet: Date;
}

export const modelizer = (_: SpaceXData): ModelizedSectionData => ({
  elonMuskBet: new Date('2026-01-01'),
  gwynneShotwellBet: new Date('2029-01-01'),
  foundingDate: new Date('2002-03-14'),
  gwynneShotwellMarsBet: new Date('2032-05-24'),
});
