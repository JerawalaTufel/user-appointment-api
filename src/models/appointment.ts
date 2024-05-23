'use strict';
const {
  Model
} = require('sequelize');

interface AppointmentAttributes {
  id: number;
  userId: number;
  date : Date;
  startTime : TimeRanges;
  endTime : TimeRanges;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Appointment extends Model <AppointmentAttributes> 
  implements AppointmentAttributes{
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    userId!: number;
    date!: Date;
    startTime!:TimeRanges;
    endTime!:TimeRanges;
    static associate(models: any) {
      // define association here
      Appointment.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Appointment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.User,
          key: 'id',
        },
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
    }
  );
  
  
  return Appointment;
}