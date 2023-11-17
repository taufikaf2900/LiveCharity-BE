'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User);
    }
  }
  Wallet.init(
    {
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    },
    {
      sequelize,
      modelName: 'Wallet',
    },
  );
  return Wallet;
};
