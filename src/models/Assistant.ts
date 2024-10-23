import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Assistant extends Model {
  public id!: number;
  public phoneNumber!: string;
  public agentType!: string;
  public openaiAssistantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Assistant.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  openaiAssistantId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Assistant'
});
