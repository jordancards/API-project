'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models')
let options = { tableName: 'Spots' }
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
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
        await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1922 Alvaris Ln',
        city: 'Gleamstone',
        state: 'Dawnshare',
        country: 'Aetheria',
        lat: 33,
        lng: -151,
        name: 'Gleamstone Inn',
        description: 'Dawnstone Inn, nestled in the heart of Dawnshare, exudes a warm and welcoming ambiance.',
        price: 70.00
      },
      {
        ownerId: 2,
        address: '350 Tavernlight',
        city: 'Lumina',
        state: 'Everglow',
        country: 'Aetheria',
        lat: 55,
        lng: -140,
        name: 'Beaming Varia',
        description: 'Beaming Varia, nestled in Lumina, dazzles with its radiant spires and bustling streets. The city pulses with energy, its markets alive with color and music.',
        price: 100.00
      },
      {
        ownerId: 3,
        address: '334 S. Nimbus Reach',
        city: 'Mistwood',
        state: 'Arborin',
        country: 'Aetheria',
        lat: 35,
        lng: -195,
        name: 'Silent Shade Sanctuary',
        description: 'Where the dense canopy of ancient trees obscures the sunlight, casting everything below in a perpetual twilight.',
      price: 150.00,
          },
      {
        ownerId: 1,
        address: '22 E. Lunar Valley',
        city: 'Moonreach',
        state: 'Silvercrest',
        country: 'Aetheria',
        lat: 90,
        lng: -102,
        name: 'Moonbeam Haven',
        description: 'In the realm of Moonreach, beckons weary travelers with its serene beauty and tranquil atmosphere.',
        price: 150.00
      },
      {
        ownerId: 2,
        address: '01 Pyropeak',
        city: 'Emberfall',
        state: 'Firepeak',
        country: 'Aetheria',
        lat: 80,
        lng: -70,
        name: 'Emberfall Retreat',
        description: 'Ember\'s Edge Retreat is nestled at the base of the dormant volcano. Within the inn, a sense of calm prevails, with cozy furnishings inviting weary travelers to unwind and relax.',
        price: 50.00
      },
      {
              ownerId: 3,
        address: '122 Stormweave Circle',
        city: 'Stormhaven',
        state: 'Thunderhold',
        country: 'Aetheria',
        lat: 40,
        lng: -150,
        name: 'StormHaven Inn',
        description: 'Stormhaven Inn stands as a bastion of hospitality, offering weary travelers a warm bed and a friendly smile amidst the tempestuous seas of Thunderhold.',
        price: 50.00
      },
      {
        ownerId: 1,
        address: '50 Sapphire Basin',
        city: 'Serenity Falls',
        state: 'Crystalbrooks',
        country: 'Aetheria',
        lat: 24,
        lng: -123,
        name: 'Serenity Springs Cottage',
        description: 'Serenity Springs Cottage, nestled in the heart of the Great Sapphire Basin in Serenity Falls, Crystalbrooks, exudes a tranquil charm amidst the breathtaking beauty of its surroundings.',
        price: 300.00
          },
      {
              ownerId: 2,
        address: '1 Frostholm Peak',
        city: 'Frostholm',
        state: 'Frostwind',
        country: 'Aetheria',
        lat: 30,
        lng: -30,
        name: 'Frostholm Peak Ascent',
        description: 'It promises a breathtaking reward at its summit. The path ahead winds through towering evergreens and across frozen streams.',
        price: 50.00
          },
      {
          ownerId: 3,
        address: '12 W. Zephyr Heights',
        city: 'Willowbrook',
        state: 'Verdantvale',
        country: 'Aetheria',
        lat: 70,
        lng: -100,
        name: 'Legends Retreat',
        description: 'Legends Retreat is a serene haven nestled amidst the gentle hills and whispering willows.',
        price: 500.00
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

      name: { [Op.in]: ['Gleamstone Inn', 'Beaming Varia','Silent Shade Sanctuary','Moonbeam Haven','Emberfall Retreat','StormHaven Inn','Serenity Springs Cottage','Frostholm Peak Ascent','Legends Retreat' ]}
    })
  }
};
