import { client } from '../utils/db';
import { DataTypes } from 'sequelize';

export const User = client.define(
  'user',
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
  },
  {
    tableName: 'users',
  },
);

export const initUsers = async () => {
  await User.sync({ force: true });
};
