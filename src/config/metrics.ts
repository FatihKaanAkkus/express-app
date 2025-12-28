import { Registry, Counter, Histogram } from 'prom-client';

export const register = new Registry();

// HTTP request counter
export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Authentication operations counter
export const authOperationsCounter = new Counter({
  name: 'auth_operations_total',
  help: 'Total number of authentication operations',
  labelNames: ['operation'], // 'register', 'login', 'logout', 'profile'
  registers: [register],
});

// User operations counter
export const userOperationsCounter = new Counter({
  name: 'user_operations_total',
  help: 'Total number of user operations',
  labelNames: ['operation'], // 'index', 'create', 'show'
  registers: [register],
});

// Cache hit/miss counter
export const cacheCounter = new Counter({
  name: 'cache_operations_total',
  help: 'Total number of cache operations',
  labelNames: ['operation', 'result'], // operation: 'get'|'set'|'del', result: 'hit'|'miss'
  registers: [register],
});
