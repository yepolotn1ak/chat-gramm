/* eslint-disable no-case-declarations */
import axios from "axios";
import { API_URL } from "../constants/constants";
import { additionalService } from "./additionalService";
import * as Types from "../types/types";

export const createRequest = async (request: Types.Request) => {
  const { type, actions, body, errorText, socket: roomSocket } = request;
  const {
    onLogin = () => { },
    setNewRoomName = () => { },
    setRooms = () => { },
    setRoomIsChanging = () => { },
    setSelectedRoom = () => { },
    onLogout = () => { },
  } = actions;

  try {
    switch (type) {
      case Types.RequestType.FethRooms: {
        const { data: rooms } = await axios.get(`${API_URL}room/chatRooms`);
        setRooms(additionalService.getSortedRooms(rooms as Types.Room[]));
        break;
      }

      case Types.RequestType.Login: {
        const { data } = await axios.post(`${API_URL}user/login`, body);
        onLogin(data as Types.User);
        localStorage.setItem('author', JSON.stringify(data));
        Object.keys(sessionStorage)
          .filter(key => key.startsWith('sharedRoomKey-'))
          .forEach(key => sessionStorage.removeItem(key));
        break;
      }

      case Types.RequestType.Logout: {
        await axios.post(`${API_URL}user/logout`, body);
        onLogout();
        localStorage.removeItem('author');
        Object.keys(sessionStorage)
          .filter(key => key.startsWith('sharedRoomKey-'))
          .forEach(key => sessionStorage.removeItem(key));
        roomSocket?.send(JSON.stringify({
          type: Types.RoomOperation.Logout,
          userId: body?.user?.id
        }));
        break;
      }

      case Types.RequestType.RoomSelect: {
        const { data: selectedRoom } = await axios.get(`${API_URL}room/getRoom/${body?.id}`);
        if (body?.prevRoomId) {
          sessionStorage.removeItem(`sharedRoomKey-${body?.prevRoomId}`);
        }
        setSelectedRoom(selectedRoom as Types.Room);
        break;
      }

      case Types.RequestType.RoomCreate: {
        const { data: newRoom } = await axios.post(`${API_URL}room/createRoom`, body);
        setNewRoomName('');
        roomSocket?.send(JSON.stringify({
          type: Types.RoomOperation.Create,
          room: newRoom
        }));
        break;
      }

      case Types.RequestType.RoomRename: {
        const { data: updatedRoom } = await axios.post(`${API_URL}room/editRoom`, body);
        setRoomIsChanging(false);
        roomSocket?.send(JSON.stringify({
          type: Types.RoomOperation.Rename,
          room: updatedRoom
        }));
        break;
      }

      case Types.RequestType.RoomDelete: {
        await axios.post(`${API_URL}room/deleteRoom`, body);
        sessionStorage.removeItem(`sharedRoomKey-${body?.id}`);
        roomSocket?.send(JSON.stringify({
          type: Types.RoomOperation.Delete,
          deletedRoomId: body?.id
        }));
        break;
      }
    }
  } catch (error) {
    console.error(errorText, error);
  }
};