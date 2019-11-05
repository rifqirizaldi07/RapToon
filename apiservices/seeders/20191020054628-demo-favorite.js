'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {  
      return queryInterface.bulkInsert('favorites', [
        {
          sketch_id: 1,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          sketch_id: 2,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          sketch_id: 3,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('favorites', null, {});
  }
};
