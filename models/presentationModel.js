// models/presentationModel.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/db');
const { id } = require('date-fns/locale');

const Presentation = sequelize.define('presentation', {
  presentation_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_updated_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  thumbnail_image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Presentation;
