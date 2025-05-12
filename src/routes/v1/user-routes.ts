import { Router } from 'express';
import validateUser from '@/middlewares/validate-user';
import * as userController from '@/controllers/user-controller';
import cachedResource from '@/middlewares/cached-resource';

const router = Router();

router.get('/', [cachedResource.indexUsers()], userController.indexUsers);
router.post('/', [validateUser.create()], userController.createUser);
router.get('/:id', [cachedResource.showUser()], userController.showUser);

export default router;
