import './App.scss';
import * as Types from './types/types';
import { useEffect, useState } from 'react';
import { ManagementBlock } from './components/ManagementBlock/ManagementBlock';
import { ChatBlock } from './components/ChatBlock/ChatBlock';
import { LoginForm } from './components/LoginForm/LoginForm';
import { API_WEBSOCKET } from './constants/constants';
import { createSocket } from './service/createSocket';
import { createRequest } from './service/createRequest';

export const App = () => {
  const [author, setAuthor] = useState<Types.User | null>(null);
  const [rooms, setRooms] = useState<Types.Room[]>([]);
  const [messages, setMessages] = useState<Types.Message[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Types.Room | null>(null);
  const [newNameOfRoom, setNewNameOfRoom] = useState('');
  const [roomIsChanging, setRoomIsChanging] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const createdSocket = createSocket({
      type: Types.SocketType.Room,
      url: API_WEBSOCKET,
      createData: { selectedRoom },
      actions: { setRooms, setSelectedRoom, setMessages },
    });

    setSocket(createdSocket);

    // Додаємо heartbeat (ping) для message сокета
    const pingInterval = setInterval(() => {
      if (createdSocket.readyState === WebSocket.OPEN) {
        createdSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 секунд

    return () => {
      clearInterval(pingInterval);
      createdSocket.close();
      setSocket(null);
    };
  }, [selectedRoom]);

  useEffect(() => {
    const authorFromStorage = localStorage.getItem('author');
    setAuthor(authorFromStorage ? JSON.parse(authorFromStorage) as Types.User : null);
  }, []);

  useEffect(() => {
    createRequest({
      type: Types.RequestType.FethRooms,
      actions: { setRooms },
      errorText: Types.RequestError.FethRooms,
    });
  }, [author, refresh]);

  const login = (user: Types.User) => {
    setAuthor(user);
    setSelectedRoom(null);
  };

  const logout = () => {
    setAuthor(null);
    setSelectedRoom(null);
    setMessages([]);
  };

  const handleSelectRoom = (room: Types.Room) => {
    createRequest({
      type: Types.RequestType.RoomSelect,
      actions: { setSelectedRoom, setRefresh },
      body: { id: room.id },
      errorText: Types.RequestError.RoomSelect,
    });
  };

  return (
    <main className='aplication'>
      {!author && <LoginForm onLogin={login} />}

      <ManagementBlock
        author={author}
        selectedRoom={selectedRoom}
        rooms={rooms}
        setRooms={setRooms}
        setSelectedRoom={handleSelectRoom}
        setRoomIsChanging={setRoomIsChanging}
        setNewNameOfRoom={setNewNameOfRoom}
        setNewMessageText={setNewMessageText}
        setRefresh={setRefresh}
        onLogout={logout}
        roomSocket={socket}
      />

      <ChatBlock
        author={author}
        messages={messages}
        setMessages={setMessages}
        selectedRoom={selectedRoom}
        roomIsChanging={roomIsChanging}
        newNameOfRoom={newNameOfRoom}
        newMessageText={newMessageText}
        setNewNameOfRoom={setNewNameOfRoom}
        setNewMessageText={setNewMessageText}
        setSelectedRoom={setSelectedRoom}
        setRoomIsChanging={setRoomIsChanging}
        setRooms={setRooms}
        setRefresh={setRefresh}
        roomSocket={socket}
      />
    </main>
  );
}
