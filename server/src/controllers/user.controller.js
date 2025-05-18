import { userService } from '../services/user.service.js';

class UserController {
  login = async (req, res) => {
    const { name } = req.body;

    const newUser = await userService.createUser(name);

    res.send(newUser);
  };
  logout = async (req, res) => {
    const { user } = req.body;

    await userService.deleteUser(user.id);

    res.sendStatus(204);
  };
}

export const userController = new UserController();
