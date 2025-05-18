import { initUsers } from '../models/user.model';
import { initRooms } from '../models/room.model';
import { initMessages } from '../models/message.model';

class ServerUtils {
  catchError = (action) => {
    return async function (req, res, next) {
      try {
        await action(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
  initTables = async () => {
    await initUsers();
    await initRooms();
    await initMessages();
  };
}

export const Utils = new ServerUtils();
