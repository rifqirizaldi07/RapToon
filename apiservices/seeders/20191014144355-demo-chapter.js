'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'chapters',
      [
        {
          chapter_title: 'Episode 1',
          image:
            'https://cdn.idntimes.com/content-images/community/2019/03/opera-snapshot-2019-03-13-211947-wwwwebtoonscom-0f5ff5e345298954bf286ad981cd4c9c_600x400.png',
          sketch_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapter_title: 'Episode 2',
          image:
            'https://swebtoon-phinf.pstatic.net/20190219_289/1550559227153tM3Y1_JPEG/thumb_ipad.jpg',
          sketch_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapter_title: 'Episode 1',
          image:
            'https://swebtoon-phinf.pstatic.net/20171202_17/1512140898074KBA7B_JPEG/thumb_ipad.jpg',
          sketch_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          chapter_title: 'Episode 2',
          image:
            'https://swebtoon-phinf.pstatic.net/20190826_51/1566745782829lKBue_JPEG/thumb_M.jpg',
          sketch_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('chapters', null, {});
  },
};
