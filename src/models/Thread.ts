import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Thread extends Model {
  public id!: number;
  public userId!: number;
  public assistantId!: number;
  public openaiThreadId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Thread.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assistantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Assistants',
      key: 'id'
    }
  },
  openaiThreadId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Thread'
});