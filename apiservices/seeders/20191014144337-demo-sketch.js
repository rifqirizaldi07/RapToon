'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'sketches',
      [
        {
          title: 'The Secret Angel',
          genre: 'Romance',
          isFavorite: true,
          image:
            'https://cdn.idntimes.com/content-images/community/2019/03/opera-snapshot-2019-03-13-211947-wwwwebtoonscom-0f5ff5e345298954bf286ad981cd4c9c_600x400.png',
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Pasturi Gaje',
          genre: 'Comedy',
          isFavorite: false,
          image:
            'https://cdn.idntimes.com/content-images/community/2019/03/6d0a9079a454d64fc74322862c0de1ed-66a00b52de00ef98aae34bee81593598_600x400.jpg',
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Crazy Sister',
          genre: 'Drama',
          isFavorite: true,
          image:
            'https://66.media.tumblr.com/7973d478696a54d5220025dd8058040d/tumblr_peo7iir2Ra1rkxh0o_540.png',
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Young Mom',
          genre: 'Drama',
          isFavorite: true,
          image:
            'https://cdn.idntimes.com/content-images/community/2019/05/my-anti-fan-cover-1-8c08a8bc18c2eb167c7d63c3d9cc33f1_600x400.jpg',
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('sketches', null, {});
  },
};
