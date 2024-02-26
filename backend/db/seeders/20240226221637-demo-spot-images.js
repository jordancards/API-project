'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    'use strict';

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require('../models')
let options = { tableName: 'SpotImages'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://www.imghippo.com/i/RH7wG1708986922.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.imghippo.com/i/wlOfK1708986947.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.imghippo.com/i/nXkPe1708986975.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.imghippo.com/i/s7OzP1708986999.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.imghippo.com/i/83iB71708987025.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://www.imghippo.com/i/UbKZ41708987054.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://www.imghippo.com/i/M9X2i1708987080.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://www.imghippo.com/i/6On4P1708987135.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://www.imghippo.com/i/9Kk9I1708987171.jpg',
        preview: true
      },


    ], options, { validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5,6]}
    })
  }
};
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
