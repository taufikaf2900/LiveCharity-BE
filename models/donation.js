'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    static associate(models) {
      Donation.belongsTo(models.User);
      Donation.belongsTo(models.Livestream);
    }
  }
  Donation.init({
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
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Amount is required'
        },
        notEmpty: {
          args: true,
          msg: 'Amount is required'
        }
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Comment is required'
        },
        notEmpty: {
          args: true,
          msg: 'Comment is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};