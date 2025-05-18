import * as Types from "../types/types";

export const additionalService = {
  getMessageTime: (date: string) => {
    return new Date(date).toLocaleTimeString('uk-UA', {
      hour: '2-digit', minute: '2-digit',
    })
  },
  getSortedRooms: (rooms: Types.Room[]) => {
    return rooms.sort((room1, room2) => {
      return new Date(room2.createdAt).getTime() - new Date(room1.createdAt).getTime();
    })
  }
};
