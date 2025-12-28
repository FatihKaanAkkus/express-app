import { Router } from 'express';
import * as authController from '@/controllers/auth-controller';
import auth from '@/middlewares/auth';
import validateAuth from '@/middlewares/validate-auth';

const router = Router();

router.post('/register', [validateAuth.register()], authController.register);
router.post('/login', [validateAuth.login()], authController.login);
router.get('/profile', [auth.require()], authController.profile);

export default router;
