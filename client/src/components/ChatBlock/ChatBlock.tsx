/* eslint-disable react/prop-types */
import './ChatBlock.scss';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ChatModale } from '../ChatModale/ChatModale';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { MessageItem } from '../MessageItem/MessageItem';
import { API_WEBSOCKET } from '../../constants/constants';
import { createSocket } from '../../service/createSocket';
import { createRequest } from '../../service/createRequest';
import * as Types from '../../types/types';
import * as encryptionService from '../../service/encryptionService';

interface Props {
  author: Types.User | null,
  messages: Types.Message[],
  setMessages: React.Dispatch<React.SetStateAction<Types.Message[]>>,
  selectedRoom: Types.Room | null,
  roomIsChanging: boolean,
  newNameOfRoom: string,
  newMessageText: string,
  setNewNameOfRoom: (value: string) => void
  setNewMessageText: (value: string) => void
  setSelectedRoom: (value: Types.Room | null) => void,
  setRoomIsChanging: React.Dispatch<React.SetStateAction<boolean>>,
  setRooms: (value: React.SetStateAction<Types.Room[]>) => void,
  setRefresh: (callback: (flag: boolean) => boolean) => void,
  roomSocket: WebSocket | null,
}

export const ChatBlock: React.FC<Props> = ({
  author,
  messages,
  setMessages,
  selectedRoom,
  roomIsChanging,
  newNameOfRoom,
  newMessageText,
  setNewNameOfRoom,
  setNewMessageText,
  setSelectedRoom,
  setRoomIsChanging,
  setRooms,
  setRefresh,
  roomSocket,
}) => {
  const messageListRef = useRef<HTMLUListElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedRoom) {
      return;
    }

    const createdSocket = createSocket({
      type: Types.SocketType.Message,
      url: API_WEBSOCKET,
      createData: { selectedRoom },
      actions: { setRooms, setMessages },
    });

    setSocket(createdSocket);

    return () => {
      createdSocket.close();
      setSocket(null);
    };
  }, [selectedRoom, setMessages, setRooms, socket]);


  const sendMessage = async (text: string) => {
    if (socket && selectedRoom) {
      const sharedRoomKey = sessionStorage.getItem(`sharedRoomKey-${selectedRoom.id}`);

      if (!sharedRoomKey) {
        console.error("Немає ключа чату для шифрування");
        return;
      }

      // Шифруємо повідомлення перед відправленням
      const encryptedText = await encryptionService.encryptMessage(text, sharedRoomKey);
      socket.send(
        JSON.stringify({
          type: Types.MessageOperation.NewMessage,
          userId: author?.id,
          text: encryptedText,
          roomId: selectedRoom.id
        })
      );
    }
  };

  const handleSubmitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (author && selectedRoom && newMessageText.trim()) {
      sendMessage(newMessageText.trim());
      setNewMessageText('');
    }
  };

  const editName = () => {
    if (selectedRoom && !newNameOfRoom.trim()) {
      setNewNameOfRoom(selectedRoom.name);
      setRoomIsChanging(false);
      return;
    }

    createRequest({
      type: Types.RequestType.RoomRename,
      actions: { setRoomIsChanging, setSelectedRoom },
      body: { id: selectedRoom?.id, newName: newNameOfRoom.trim() },
      errorText: Types.RequestError.RoomRename,
      socket: roomSocket,
    });
  };

  const handleEditName = () => {
    if (selectedRoom) {
      setNewNameOfRoom(selectedRoom.name);
      setRoomIsChanging(true);
    }
  };

  const closeHelper = () => {
    setSelectedRoom(null);
    setRoomIsChanging(false);
    setMessages([]);
    setNewMessageText('');
    setRefresh(cur => !cur);
    sessionStorage.removeItem(`sharedRoomKey-${selectedRoom?.id}`);
  };

  const handleDeleteRoom = (id: string | undefined) => {
    createRequest({
      type: Types.RequestType.RoomDelete,
      actions: {},
      body: { id },
      errorText: Types.RequestError.RoomDelete,
      socket: roomSocket,
    });
  };

  const scrollDown = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => scrollDown(), [messages]);

  return (
    <section className={classNames('chat-block', {
      'chat-block__display': selectedRoom,
    })}>
      <article className="chat-block__info">
        {!roomIsChanging && (
          <h1 className='chat-block__info--title'>
            {selectedRoom ? `${selectedRoom.name}` : 'Назва чату...'}
          </h1>
        )}

        {selectedRoom && roomIsChanging && (
          <form className='chat-block__info--form' onSubmit={event => {
            event.preventDefault();
            editName();
          }}>
            <Input
              type={Types.Input.RoomRename}
              value={newNameOfRoom}
              placeholder={Types.PlaceHolder.RoomRename}
              onChange={setNewNameOfRoom}
              onBlur={editName}
            />
          </form>
        )}

        <div className={classNames('chat-block__info--buttons', {
          'chat-block__info--display': selectedRoom,
        })}>
          {author?.id === selectedRoom?.userId && (
            <>
              <Button type={Types.Button.Rename} onCLick={handleEditName} />
              <Button type={Types.Button.Delete} disabled={roomIsChanging} onCLick={() => handleDeleteRoom(selectedRoom?.id)} />
            </>
          )}
          <Button type={Types.Button.Close} onCLick={closeHelper} />
        </div>
      </article>

      <article className="chat-block__chat">
        <ChatModale author={author} messages={messages} selectedRoom={selectedRoom} />

        <ul ref={messageListRef} className="chat-block__chat--messages">
          {messages.map(message => (
            <MessageItem key={message.id} message={message} author={author} />
          ))}
        </ul>

        <form
          className={classNames('chat-block__form', {
            'chat-block__form--display': selectedRoom,
          })}
          onSubmit={handleSubmitMessage}
        >
          <Input
            type={Types.Input.Send}
            value={newMessageText}
            placeholder={Types.PlaceHolder.Send}
            onChange={setNewMessageText}
          />

          <Button type={Types.Button.Send} />
        </form>
      </article>
    </section>
  );
}
