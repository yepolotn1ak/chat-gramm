/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as encryptionService from '../service/encryptionService';
import * as Types from "../types/types";

export const createSocket = (socketData: Types.Socket) => {
  const { type, url, createData, actions } = socketData;
  const { selectedRoom } = createData;
  const {
    setRooms = () => { },
    setSelectedRoom = () => { },
    setMessages = () => { },
  } = actions;

  const socket = new WebSocket(url);

  switch (type) {
    case Types.SocketType.Room: {
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case Types.RoomOperation.Create:
              setRooms(currentRooms => [data.room, ...currentRooms]);
              break;

            case Types.RoomOperation.Rename: {
              setRooms(currentRooms =>
                currentRooms.map(room =>
                  room.id === data.room.id ? data.room : room
                )
              );
              if (data.room.userId === selectedRoom?.userId) {
                setSelectedRoom(data.room);
              }
              break;
            }

            case Types.RoomOperation.Delete: {
              setRooms(currentRooms => currentRooms.filter(({ id }) => id !== data.deletedRoomId));
              if (selectedRoom?.id === data.deletedRoomId) {
                setSelectedRoom(null);
                setMessages([]);
                sessionStorage.removeItem(`sharedRoomKey-${data.deletedRoomId}`);
              }
              break;
            }

            case Types.RoomOperation.Logout: {
              setRooms(currentRooms => currentRooms.filter(({ userId }) => userId !== data.userId));
              if (selectedRoom?.userId === data.userId) {
                setSelectedRoom(null);
                setMessages([]);
                sessionStorage.clear();
              }
              break;
            }
          }
        } catch (error) {
          console.error('Room socket message error:', error);
        }
      };
      break;
    }
    case Types.SocketType.Message: {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: 'init',
            roomId: selectedRoom?.id,
          }),
        );
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case Types.MessageOperation.GetKey:
              sessionStorage.setItem(`sharedRoomKey-${selectedRoom?.id}`, data.key);
              break;

            case Types.MessageOperation.GetMessages: {
              const sharedRoomKey = sessionStorage.getItem(`sharedRoomKey-${selectedRoom?.id}`);
              if (sharedRoomKey) {
                const decryptedMessages = await Promise.all(
                  data.value.map(async (message: Types.Message) => {
                    const decryptedText = await encryptionService.decryptMessage(message.text, sharedRoomKey);
                    return { ...message, text: decryptedText };
                  })
                );
                setMessages(decryptedMessages);
              }
              break;
            }

            case Types.MessageOperation.NewMessage: {
              const sharedRoomKey = sessionStorage.getItem(`sharedRoomKey-${selectedRoom?.id}`);
              if (sharedRoomKey) {
                const decryptedText = await encryptionService.decryptMessage(data.value.text, sharedRoomKey);
                setMessages(currentMessages => [...currentMessages, { ...data.value, text: decryptedText }]);
              }
              break;
            }
          }
        } catch (error) {
          console.error('Message socket message error:', error);
        }
      };
      break;
    }
  }

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  return socket;
};