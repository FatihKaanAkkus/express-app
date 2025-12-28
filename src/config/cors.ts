import type { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};
