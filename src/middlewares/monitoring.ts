import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.traceId = uuidv4();
    req.spanId = uuidv4();
    next();
  };
};
