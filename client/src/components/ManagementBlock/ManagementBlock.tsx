/* eslint-disable react/prop-types */
import './ManagementBlock.scss';
import { useCallback, useState } from 'react';
import { SecureComponent } from '../SecureComponent/SecureComponent';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { RoomItem } from '../RoomItem/RoomItem';
import * as Types from '../../types/types';
import { createRequest } from '../../service/createRequest';

interface Props {
  author: Types.User | null,
  rooms: Types.Room[],
  selectedRoom: Types.Room | null,
  roomSocket: WebSocket | null,
  setRooms: (value: React.SetStateAction<Types.Room[]>) => void,
  setSelectedRoom: (value: Types.Room) => void,
  setRoomIsChanging: React.Dispatch<React.SetStateAction<boolean>>,
  setNewNameOfRoom: (value: string) => void,
  setNewMessageText: (value: string) => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  onLogout: () => void,
}

export const ManagementBlock: React.FC<Props> = ({
  author,
  rooms,
  selectedRoom,
  roomSocket,
  setSelectedRoom,
  setRoomIsChanging,
  setNewNameOfRoom,
  setNewMessageText,
  setRefresh,
  onLogout,
}) => {
  const [newRoomName, setNewRoomName] = useState('');

  const handleLogout = () => {
    setNewRoomName('');

    createRequest({
      type: Types.RequestType.Logout,
      actions: { onLogout },
      body: { user: author },
      errorText: Types.RequestError.Logout,
      socket: roomSocket,
    });
  };

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newRoomName.trim()) {
      setNewRoomName('');

      return;
    }

    createRequest({
      type: Types.RequestType.RoomCreate,
      actions: { setNewRoomName, },
      body: { userId: author?.id, name: newRoomName.trim() },
      errorText: Types.RequestError.RoomCreate,
      socket: roomSocket,
    });
  };

  const handleSelectRoom = (roomToSelect: Types.Room) => {
    setSelectedRoom(roomToSelect);
    setNewNameOfRoom(roomToSelect.name);
    setRoomIsChanging(false);
    setNewMessageText('');
  };

  const refreshRooms = useCallback(() => setRefresh(prevRefresh => !prevRefresh), [setRefresh]);

  return (
    <section className='magagement'>
      <article className="magagement__user-block">
        <h1 className="magagement__user-block--title">{author ? author.name : 'Author name'}</h1>

        <Button type={Types.Button.Logout} onCLick={handleLogout} />
      </article>

      <article className="magagement__line" />

      <form className="magagement__creator" onSubmit={handleCreateRoom}>
        <div className="magagement__creator--top">
          <h1 className="magagement__creator--title">Ваші чати:</h1>

          <div className="magagement__creator--buttons">
            <Button type={Types.Button.Refresh} onCLick={refreshRooms} />
            <Button type={Types.Button.Create} />
          </div>
        </div>

        <Input
          type={Types.Input.RoomCreate}
          value={newRoomName}
          placeholder={Types.PlaceHolder.RoomCreate}
          onChange={setNewRoomName}
        />
      </form>

      <ul className='magagement__rooms'>
        <SecureComponent author={author} />

        {rooms.map(room => (
          <RoomItem
            key={room.id}
            room={room}
            selectedRoom={selectedRoom}
            author={author}
            onClick={handleSelectRoom}
          />
        ))}
      </ul>
    </section>
  );
}
