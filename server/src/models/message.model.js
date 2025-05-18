import { client } from '../utils/db.js';
import { DataTypes } from 'sequelize';
import { Room } from './room.model.js';
import { User } from './user.model.js';

export const Message = client.define(
  'message',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'messages',
  },
);

Message.belongsTo(Room, { onDelete: 'CASCADE' });
Message.belongsTo(User);
Room.hasMany(Message);

export const initMessages = async () => {
  await Message.sync({ force: true });
};
