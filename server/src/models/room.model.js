import { client } from '../utils/db.js';
import { DataTypes } from 'sequelize';
import { User } from './user.model.js';

export const Room = client.define(
  'room',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'rooms',
  },
);

Room.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Room);

export const initRooms = async () => {
  await Room.sync({ force: true });
};
