import { Router } from 'express';
import { Utils } from '../utils/utils.js';
import { userController } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.post('/login', Utils.catchError(userController.login));
userRouter.post('/logout', Utils.catchError(userController.logout));
