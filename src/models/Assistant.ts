import { Model, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';

console.log('Assistant model: Sequelize instance imported:', sequelize instanceof require('sequelize').Sequelize);

export class Assistant extends Model {
  public id!: number;
  public phoneNumber!: string;
  public agentType!: string;
  public openaiAssistantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

console.log('Initializing Assistant model');
console.log('Assistant model: Initializing Assistant model');
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
