/* eslint-disable no-console */
'use strict';

import express, { json } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { Utils } from './utils/utils.js';
import { userRouter } from './routes/user.route.js';
import { roomRouter } from './routes/room.route.js';
import { websocket } from './websocket.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

require('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();

app.use(json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

Utils.initTables();

app.use('/user', userRouter);
app.use('/room', roomRouter);

const server = app.listen(PORT, () => {
  console.log('Server is running on port: ', PORT);
});

const wss = new WebSocketServer({ server });

websocket(wss);

app.use(errorMiddleware);
