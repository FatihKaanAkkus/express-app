import { Router } from 'express';
import * as userController from '@/controllers/user-controller';
import validateUser from '@/middlewares/validate-user';
import cachedResource from '@/middlewares/cached-resource';
import auth from '@/middlewares/auth';

const router = Router();

const editorAdmin = [auth.role(['editor', 'admin'])];
const ownerEditorAdmin = [auth.role(['owner', 'editor', 'admin'])];

router.get('/', [...editorAdmin, validateUser.index(), cachedResource.indexUsers()], userController.indexUsers);
router.post('/', [...editorAdmin, validateUser.create()], userController.createUser);
router.get('/:userId', [...ownerEditorAdmin, validateUser.show(), cachedResource.showUser()], userController.showUser);
router.patch('/:userId', [...ownerEditorAdmin, validateUser.update()], userController.updateUser);
router.delete('/:userId', [...editorAdmin, validateUser.delete()], userController.deleteUser);

export default router;
