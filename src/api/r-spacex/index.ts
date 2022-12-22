import { APIAdapter } from 'api/common';
import { transformAPIData } from './dataTransformers';
import { RSXAPIData } from './types';

export const RSXAPIAdapter: APIAdapter<RSXAPIData> = {
  dataTransformer: transformAPIData,
};
