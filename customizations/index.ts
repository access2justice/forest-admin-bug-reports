import type { Schema } from '../typings';
import { Agent } from '@forestadmin/agent';
import { customizeLawyers } from './lawyers';
import { customizeOffices } from './offices';

export const customizeCollections = (agent: Agent<Schema>) => {
  agent.customizeCollection('lawyers', (collection) => customizeLawyers(collection));
  agent.customizeCollection('offices', (collection) => customizeOffices(collection));

};

export const flattenOptions = {
    test: { asModels: ['']}
};
