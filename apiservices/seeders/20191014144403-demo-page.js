'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'pages',
      [
        {
          image:
            'https://i.pinimg.com/originals/b1/ec/ce/b1ecce8b8b84345d2113b62660ac30d5.jpg',
          sketch_id: 1,
          chapter_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://i.pinimg.com/originals/c0/db/af/c0dbaf37495a29a1faba64494dee0c8f.jpg',
          sketch_id: 1,
          chapter_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://i.pinimg.com/originals/b1/ec/ce/b1ecce8b8b84345d2113b62660ac30d5.jpg',
          sketch_id: 2,
          chapter_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://i.pinimg.com/originals/ce/37/2d/ce372d818f13bf430af9af82520ced24.jpg',
          sketch_id: 2,
          chapter_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pages', null, {});
  },
};
