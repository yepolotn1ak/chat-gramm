import { User } from '../models/user.model.js';
import { ApiError } from '../exceptions/api.error.js';

class UserService {
  getUserNameById = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
      throw ApiError.badRequest({
        message: 'Not found',
      });
    }

    return user.name;
  };

  createUser = async (name) => {
    if (!name) {
      throw ApiError.badRequest({
        message: 'Validate error',
      });
    }

    const user = await User.create({
      name,
    });

    return user;
  };

  deleteUser = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
      throw ApiError.notFound({
        message: 'Not found',
      });
    }

    await user.destroy();
  };
}

export const userService = new UserService();
