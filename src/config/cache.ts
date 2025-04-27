import { createCache } from 'cache-manager';

const cache = createCache({
  ttl: 60000,
  refreshThreshold: 3000,
});

export default cache;
