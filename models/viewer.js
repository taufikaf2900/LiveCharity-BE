'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viewer extends Model {
    static associate(models) {
      Viewer.belongsTo(models.User);
      Viewer.belongsTo(models.Livestream);
    }
  }
  Viewer.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'User Id is required'
        },
        notEmpty: {
          args: true,
          msg: 'User Id is required'
        }
      }
    },
    LivestreamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Livestream Id is required'
        },
        notEmpty: {
          args: true,
          msg: 'Livestream Id is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Viewer',
  });
  return Viewer;
};