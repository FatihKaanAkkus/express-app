import { Request, Response } from 'express';
import v1 from './v1';

const root = () => {
  return (req: Request, res: Response) => {
    res.json({ message: 'Express App API', version: '0.1.0' });
  };
};

export default {
  root,
  v1,
};
