import type { Schema } from './typings';

import 'dotenv/config';
import { CollectionCustomizer, HookBeforeCreateContext, createAgent } from '@forestadmin/agent';
import { createMongooseDataSource } from '@forestadmin/datasource-mongoose';
import connection from './models';
import { customizeCollections, flattenOptions } from './customizations';

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
agent.addDataSource(createMongooseDataSource(connection, { flattenMode: 'manual', flattenOptions  }));

customizeCollections(agent);


// Expose an HTTP endpoint.
agent.mountOnStandaloneServer(Number(process.env.APPLICATION_PORT));

// Start the agent.
agent.start().catch(error => {
  console.error('\x1b[31merror:\x1b[0m Forest Admin agent failed to start\n');
  console.error('');
  console.error(error.stack);
  process.exit(1);
});
