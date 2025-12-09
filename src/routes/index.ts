import { Request, Response } from 'express';
import { register } from '@/config/metrics';
import v1 from './v1';

const root = () => {
  return (req: Request, res: Response) => {
    res.json({
      message: 'Express App API',
      description: 'This is the root endpoint of the Express App API.',
      versions: {
        v1: '/v1',
      },
      documentation: '',
      authentication: '',
      rate_limit: '',
    });
  };
};

const metrics = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
};

export default {
  root,
  v1,
  metrics,
};
