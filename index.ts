import type { Schema } from './typings';

import 'dotenv/config';
import { CollectionCustomizer, HookBeforeCreateContext, createAgent } from '@forestadmin/agent';
import { createMongooseDataSource } from '@forestadmin/datasource-mongoose';
import connection from './models';

// This object allows to configure your Forest Admin panel
const agent = createAgent<Schema>({
  // Security tokens
  authSecret: process.env.FOREST_AUTH_SECRET!,
  envSecret: process.env.FOREST_ENV_SECRET!,

  // Make sure to set NODE_ENV to 'production' when you deploy your project
  isProduction: process.env.NODE_ENV === 'production',

  // Autocompletion of collection names and fields
  typingsPath: './typings.ts',
  typingsMaxDepth: 5,
});

// Connect your datasources
// All options are documented at https://docs.forestadmin.com/developer-guide-agents-nodejs/data-sources/connection
agent.addDataSource(createMongooseDataSource(connection, { flattenMode: 'auto' }));

agent.customizeCollection('test', (collection: CollectionCustomizer<Schema, 'test'>) => {
  // Actions are documented here:
  // https://docs.forestadmin.com/developer-guide-agents-nodejs/agent-customization/actions
  collection.addHook( 'Before','Create', async (context) => {
    setContextToSlug(context);
   });
});

// It might look strange to separate this in a different function, but this is something I need quite often throughout the codebase.
const setContextToSlug = async (context:  HookBeforeCreateContext<Schema, 'test'> ) => {
  const slug = `${context.data[0].firstName.toLowerCase()}-${context.data[0].lastName.toLowerCase()}`;
  const namesake = await context.collection.list({ conditionTree: { field: 'slug', value: slug, operator: 'Equal' }}, [ '_id'])
  if (namesake.length > 0) {
    context.data[0].slug = slug;
  } else context.data[0].slug = slug + 'random_number'
}

// Expose an HTTP endpoint.
agent.mountOnStandaloneServer(Number(process.env.APPLICATION_PORT));

// Start the agent.
agent.start().catch(error => {
  console.error('\x1b[31merror:\x1b[0m Forest Admin agent failed to start\n');
  console.error('');
  console.error(error.stack);
  process.exit(1);
});
