/* eslint-disable no-console */
/* eslint-disable no-shadow */
const crypto = require('crypto');
const { roomService } = require('../services/room.service.js');
const { messageService } = require('../services/message.service.js');

// Зберігає спільні ключі для кожної кімнати
const rooms = {};

// Ініціалізація кімнати та ключа
const initializeRoom = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = crypto.randomBytes(32).toString('base64');
  }

  return rooms[roomId];
};

// const PING_INTERVAL = 30000; // 30 секунд

const websocket = (wss) => {
  wss.on('connection', (connection) => {
    let roomId;

    // Heartbeat для клієнта
    // connection.isAlive = true;

    // connection.on('pong', () => {
    //   connection.isAlive = true;
    // });

    connection.on('message', async (newMessage) => {
      try {
        const data = JSON.parse(newMessage);

        // Ініціалізація кімнати
        if (data.type === 'init' && data.roomId) {
          roomId = data.roomId;
          connection.roomId = roomId;

          const joinRooms = await roomService.getRoomById(roomId);

          if (joinRooms) {
            // Ініціалізація спільного ключа для чату
            const roomKey = initializeRoom(roomId);

            connection.send(
              JSON.stringify({
                type: 'roomKey',
                key: roomKey,
              }),
            );

            // Надсилаємо історію зашифрованих повідомлень
            const messages = await messageService.getMessagesByRoomId(roomId);

            connection.send(
              JSON.stringify({
                type: 'roomMessages',
                value: messages,
              }),
            );
          } else {
            connection.send(JSON.stringify({ error: 'Room not found' }));
          }

          return;
        }

        // Надсилання повідомлення
        if (data.type === 'newMessage' && roomId) {
          const { userId, text } = data;
          const message = await messageService.createMessage({
            userId,
            text,
            roomId,
          });

          wss.clients.forEach((client) => {
            if (client.roomId === roomId) {
              client.send(
                JSON.stringify({
                  type: 'newMessage',
                  value: message,
                }),
              );
            }
          });

          return;
        }

        // Створення кімнати
        if (data.type === 'roomCreated') {
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({ type: 'roomCreated', room: data.room }),
            );
          });

          return;
        }

        // Редагування кімнати
        if (data.type === 'roomRenamed') {
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({ type: 'roomRenamed', room: data.room }),
            );
          });

          return;
        }

        // Видалення кімнати
        if (data.type === 'roomDeleted') {
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: 'roomDeleted',
                deletedRoomId: data.deletedRoomId,
              }),
            );
          });
          // delete rooms[data.deletedRoomId];

          return;
        }

        // Видалення користувача
        if (data.type === 'userLogout') {
          // const roomsToDelete = await roomService.
          // getRoomsByUserId(data.userId);

          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: 'userLogout',
                userId: data.userId,
                // roomsToDelete,
              }),
            );
          });
          // roomsToDelete.forEach((room) => delete rooms[room.id]);

          return;
        }

        // Якщо команда не розпізнана
        connection.send(JSON.stringify({ error: 'Unknown command' }));
      } catch (error) {
        console.error('WebSocket Error:', error);
        connection.send(JSON.stringify({ error: 'Server error' }));
      }
    });

    connection.on('close', () => {
      console.log(`Client left the room ${roomId}`);
    });
  });

  // // Серверний heartbeat/ping для всіх клієнтів
  // setInterval(() => {
  //   wss.clients.forEach((ws) => {
  //     if (ws.isAlive === false) {
  //       ws.terminate();

  //       return;
  //     }
  //     ws.isAlive = false;
  //     ws.ping();
  //   });
  // }, PING_INTERVAL);
};

module.exports = { websocket };
