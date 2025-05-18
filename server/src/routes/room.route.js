import { Router } from 'express';
import { Utils } from '../utils/utils.js';
import { roomController } from '../controllers/room.controller.js';

export const roomRouter = Router();

roomRouter.get('/chatRooms', Utils.catchError(roomController.getRooms));
roomRouter.get('/getRoom/:id', Utils.catchError(roomController.getRoomById));
roomRouter.post('/createRoom', Utils.catchError(roomController.create));
roomRouter.post('/deleteRoom', Utils.catchError(roomController.deleteRoom));
roomRouter.post('/editRoom', Utils.catchError(roomController.edit));
