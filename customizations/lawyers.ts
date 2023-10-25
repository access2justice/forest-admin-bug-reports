import type { Schema } from '../typings';
import { CollectionCustomizer } from '@forestadmin/datasource-customizer';

export const flattenOptions = {
  asFields: ['languages', 'experience', 'education', 'practiceAreas', 'publications'],
  asModels: ['languages', 'experience', 'education', 'practiceAreas', 'publications', 'billing'],
};

export const customizeLawyers = (collection: CollectionCustomizer<Schema, 'lawyers'>) => {};
