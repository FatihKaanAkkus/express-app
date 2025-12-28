import type { Request, Response } from 'express';
import v1 from './v1';
import metrics from './metrics';

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

export default {
  root,
  metrics,
  v1,
};
