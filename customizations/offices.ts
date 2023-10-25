import type { Schema } from '../typings';
import { CollectionCustomizer } from '@forestadmin/datasource-customizer';

export const customizeOffices = (collection: CollectionCustomizer<Schema, 'offices'>) => {
    collection.addField('name', {
        dependencies: ['street', 'municipality'],
        columnType: 'String',
        getValues: (records) => {
            return records.map(r => `${r.street}, ${r.municipality}`)
        }
    }

    )
};
