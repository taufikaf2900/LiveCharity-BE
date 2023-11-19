'use strict';
const { hashPassword } = require('../helpers/bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = require('../database/users.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hashPassword(el.password);
      return el;
    });

    const category = require('../database/category.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    const campaign = require('../database/campaign.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    const wallets = require('../database/wallet.json').map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert('Users', users, {});
    await queryInterface.bulkInsert('Categories', category, {});
    await queryInterface.bulkInsert('Livestreams', campaign, {});
    await queryInterface.bulkInsert('Wallets', wallets, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Category', null, {});
    await queryInterface.bulkDelete('Livestreams', null, {});
    await queryInterface.bulkDelete('Wallets', null, {});
  },
};
