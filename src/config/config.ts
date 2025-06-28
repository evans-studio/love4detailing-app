// This file is the single source of truth for the active client configuration.
// To switch to a different client, change the import path.

import { love4detailingConfig } from './clients/love4detailing';
import { clientConfigSchema } from './schema';

// Validate the configuration against the master schema to ensure consistency.
const validatedConfig = clientConfigSchema.parse(love4detailingConfig);

export default validatedConfig; 