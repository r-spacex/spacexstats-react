import { APIAdapter } from 'data/common';
import { transformAPIData } from './dataTransformers';
import { LLAPIData } from './types';

export const LLAPIAdapter: APIAdapter<LLAPIData> = {
  dataTransformer: transformAPIData,
};
