import type { Request, Response } from 'express';
import { register } from '@/config/metrics';

const metrics = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
};

export default metrics;
