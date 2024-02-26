'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require('../models')
let options = { tableName: 'Bookings' };
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
    await Booking.bulkCreate([
      {
      spotId:1,
      userId:1,
      startDate:'2024-02-22',
      endDate:'2024-02-23'
    },
    {
      spotId:2,
      userId:1,
      startDate:'2024-03-02',
      endDate:'2024-03-05'
    },
    {
      spotId:3,
      userId:2,
      startDate:'2024-03-06',
      endDate:'2024-03-09'
    },
    {
      spotId:4,
      userId:3,
      startDate:'2024-03-15',
      endDate:'2024-03-25'
    },
    {
      spotId:5,
      userId:2,
      startDate:'2024-04-26',
      endDate:'2024-04-29'
    },
    {
      spotId:6,
      userId:1,
      startDate:'2024-05-10',
      endDate:'2024-05-30'
    },
    ], options, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
