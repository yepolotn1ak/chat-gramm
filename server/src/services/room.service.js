import { Room } from '../models/room.model.js';
import { ApiError } from '../exceptions/api.error.js';

class RoomService {
  getAllRooms = async () => {
    const rooms = await Room.findAll();

    return rooms;
  };

  getRoomById = async (roomId) => {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw ApiError.notFound({
        message: 'Room not found',
      });
    }

    return room;
  };

  createRoom = async ({ userId, name }) => {
    if (!name) {
      throw ApiError.badRequest({
        message: 'Validate error',
      });
    }

    if (!userId) {
      throw ApiError.badRequest({
        message: 'User is required',
      });
    }

    const room = await Room.create({ name, userId });

    return room;
  };

  deleteRoom = async (roomId) => {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw ApiError.notFound({
        message: 'Not found',
      });
    }

    await room.destroy();
  };

  updateRoom = async ({ id, name }) => {
    await Room.update({ name }, { where: { id } });

    const room = await Room.findByPk(id);

    if (!room) {
      throw ApiError.notFound({
        message: 'Nor found',
      });
    }

    return room;
  };
}

export const roomService = new RoomService();
