import { SpaceXStatsData } from 'types/index';

export interface BuildInfoData {
  currentBuildDate: {
    currentDate: string;
  };
}

export interface APIAdapter<T> {
  dataTransformer: (data: T) => SpaceXStatsData;
}
