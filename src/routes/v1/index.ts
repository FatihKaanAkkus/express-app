import { Router } from 'express';
import userRoutes from './user-routes';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Express App API',
    version: '1.0.0',
    description: 'This is the v1 endpoint of the Express App API.',
    endpoints: {
      users: '/v1/users',
    },
    documentation: '',
    authentication: '',
    rate_limit: '',
  });
});

router.use('/users', userRoutes);

export default router;
