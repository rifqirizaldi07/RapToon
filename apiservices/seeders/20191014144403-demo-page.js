'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'pages',
      [
        {
          image:
            'https://yuucdn.com/wp-content/uploads/O/One%20Piece/Chapter%20951/01.jpg',
          sketch_id: 1,
          chapter_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/O/One%20Piece/Chapter%20951/02.jpg',
          sketch_id: 1,
          chapter_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/H/Haikyuu/Chapter%20361/003.jpg',
          sketch_id: 2,
          chapter_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/H/Haikyuu/Chapter%20361/004.jpg',
          sketch_id: 2,
          chapter_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/B/Boku%20No%20Hero%20Academia/Chapter%20241/03.jpg',
          sketch_id: 3,
          chapter_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/B/Boku%20No%20Hero%20Academia/Chapter%20241/04.jpg',
          sketch_id: 3,
          chapter_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/D/Dr%20Stone%20Mangakyo/Chapter%20121/02.jpg',
          sketch_id: 4,
          chapter_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image:
            'https://yuucdn.com/wp-content/uploads/D/Dr%20Stone%20Mangakyo/Chapter%20121/03.jpg',
          sketch_id: 4,
          chapter_id: 4,
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
