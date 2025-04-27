import { Router } from 'express';
import { validateCreateUser } from '@/middlewares/validate-user';
import * as userController from '@/controllers/user-controller';
import { checkCachedUser, checkCachedUsers } from '@/middlewares/check-cached-resource';

const router = Router();

router.get('/', [checkCachedUsers], userController.indexUsers);
router.post('/', [validateCreateUser], userController.createUser);
router.get('/:id', [checkCachedUser], userController.showUser);

export default router;
