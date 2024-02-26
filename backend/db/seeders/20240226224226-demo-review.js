'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Review } = require('../models')
let options = { tableName: 'Reviews'}
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
    await Review.bulkCreate([
    {
      spotId:1,
      userId:1,
      review: 'Was very rested and felt good to start again. A perfect one day rest stop',
      stars: 5
    },
    {
      spotId:2,
      userId:1,
      review: 'A beautiful place with gorgeous scenery, but it was difficult to ignore the forest during rest',
      stars: 4
    },
    {
      spotId:3,
      userId:2,
      review: 'An intense trail to those who dare try it... However the breathtaking views along the way, and especially at the peak were well worth it.',
      stars: 4
    },
    {
      spotId:4,
      userId:3,
      review: 'Gorgeous area, with an amazing landscape. The flowers are beautiful and the host is amazing. I would come back again.',
      stars: 5
    },
    {
      spotId:5,
      userId:2,
      review: 'Cozy however, the constant threat of the volcano erupting kept me up at night and the heat was harsh.',
      stars: 1
      },
        {
      spotId:6,
      userId:1,
      review: 'Very convenient placement, it being in the middle of the woods of my travels. However the threats of the night-time kept me on my toes at every moment',
      stars: 2
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
    }, {})
  }
};
