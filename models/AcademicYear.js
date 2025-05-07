const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = AcademicYear;
