import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class User extends Model {
  public id!: number;
  public phoneNumber!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

console.log('Initializing User model');
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  modelName: 'User'
});
