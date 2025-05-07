const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import the User model

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference the User model
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Notification.associate = (models) => {
  Notification.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

module.exports = Notification;
