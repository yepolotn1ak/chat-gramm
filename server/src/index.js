/* eslint-disable no-console */
'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { WebSocketServer } = require('ws');
const { Utils } = require('./utils/utils.js');
const { userRouter } = require('./routes/user.route.js');
const { roomRouter } = require('./routes/room.route.js');
const { websocket } = require('./websocket/websocket.js');
const { errorMiddleware } = require('./middlewares/errorMiddleware.js');

require('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

Utils.initTables();

app.use('/user', userRouter);
app.use('/room', roomRouter);

// --- HTTPS сервер ---
const sslOptions = {
  key: fs.readFileSync('/etc/ssl/private/server.key'),
  cert: fs.readFileSync('/etc/ssl/certs/server.crt'),
};

const server = https.createServer(sslOptions, app).listen(PORT, () => {
  console.log('HTTPS server is running on port:', PORT);
});

const wss = new WebSocketServer({ server });

websocket(wss);

app.use(errorMiddleware);
