import { SpaceXData } from 'types';

export interface ModelizedSectionData {
  starshipHops: number[];
}

export const modelizer = (_: SpaceXData): ModelizedSectionData => ({
  starshipHops: [0, 1, 150],
});
