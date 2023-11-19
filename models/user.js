'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Wallet);
      User.hasMany(models.Livestream);
      User.hasMany(models.Donation);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username is already used',
        },
        validate: {
          notNull: {
            args: true,
            msg: 'Username is required',
          },
          notEmpty: {
            args: true,
            msg: 'Username is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'Password is required',
          },
          notEmpty: {
            args: true,
            msg: 'Password is required',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email is already used',
        },
        validate: {
          notNull: {
            args: true,
            msg: 'Email is required',
          },
          notEmpty: {
            args: true,
            msg: 'Email is required',
          },
          isEmail: {
            args: true,
            msg: 'Invalid email format',
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (instance) => {
          instance.password = hashPassword(instance.password);
        },
      },
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
