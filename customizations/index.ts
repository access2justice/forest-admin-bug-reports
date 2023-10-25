import type { Schema } from '../typings';
import { Agent } from '@forestadmin/agent';
import { customizeLawyers, flattenOptions as lawyersFlattenOptions } from './lawyers';


export const customizeCollections = (agent: Agent<Schema>) => {
  // agent.customizeCollection('lawyers', (collection) => customizeLawyers(collection));
};

export const flattenOptions = {
    test: { asModels: ['address']}
};
