'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Livestream extends Model {
    static associate(models) {
      Livestream.belongsTo(models.User);
      Livestream.hasMany(models.Donation);
      Livestream.belongsTo(models.Category);
    }
  }
  Livestream.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Title is required',
          },
          notEmpty: {
            args: true,
            msg: 'Title is required',
          },
        },
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Room Id is required',
          },
          notEmpty: {
            args: true,
            msg: 'Room Id is required',
          },
        },
      },
      targetFunds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Target Funds is required',
          },
          notEmpty: {
            args: true,
            msg: 'Target Funds is required',
          },
        },
      },
      currentFunds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Expire Date is required',
          },
          notEmpty: {
            args: true,
            msg: 'Expire Date is required',
          },
          isExpireDateValid(value) {
            if (value <= new Date()) {
              throw new Error('Minimum time of livestream is tomorrow!');
            }
          },
        },
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
        notNull: {
          args: true,
          msg: 'Thumbnail is required',
        },
        notEmpty: {
          args: true,
          msg: 'Thumbnail is required',
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Description is required',
          },
          notEmpty: {
            args: true,
            msg: 'Description is required',
          },
        },
      },
      statusLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'User Id is required',
          },
          notEmpty: {
            args: true,
            msg: 'User Id is required',
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Category Id is required',
          },
          notEmpty: {
            args: true,
            msg: 'Category Id is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Livestream',
    },
  );
  return Livestream;
};
