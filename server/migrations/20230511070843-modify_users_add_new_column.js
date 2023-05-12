'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Users", "refreshToken", {
        type: Sequelize.STRING,
        after: "role"
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {

  }
};
