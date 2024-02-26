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
        address: 'South of Alvaris',
        city: 'Gleamstone',
        state: 'Dawnshare',
        country: 'Aetheria',
        lat: 33,
        lng: -151,
        name: 'Gleamstone Inn',
        description: 'Dawnstone Inn, nestled in the heart of Dawnshare, exudes a warm and welcoming ambiance. As you step through its doors, you are greeted by the gentle flicker of hearthlight and the comforting aroma of home-cooked meals. The inn\'s cozy interior, adorned with wooden beams and plush furnishings, invites weary travelers to unwind and relax. Friendly faces and lively chatter fill the air, creating a sense of camaraderie and community. Whether you seek a hearty meal, a soft bed for the night, or simply a moment of respite from your journey, Dawnstone Inn offers a haven of comfort and hospitality in the bustling town of Gleamstone.',
        price: 70.00
      },
      {
        ownerId: 2,
        address: 'North of Tavernlight',
        city: 'Lumina',
        state: 'Everglow',
        country: 'Aetheria',
        lat: 55,
        lng: -140,
        name: 'Beaming Varia',
        description: 'Beaming Varia, nestled in Lumina, dazzles with its radiant spires and bustling streets. The city pulses with energy, its markets alive with color and music. At its heart, the Great Plaza offers a vibrant oasis where dreams flourish beneath the city\'s radiant glow.',
        price: 100.00
      },
      {
        ownerId: 3,
        address: 'Entrance of Nimbus Reach',
        city: 'Mistwood',
        state: 'Arborin',
        country: 'Aetheria',
        lat: 35,
        lng: -195,
        name: 'Silent Shade Sanctuary',
        description: 'Silent Shade Sanctuary is nestled deep within the heart of Mistwood, where the dense canopy of ancient trees obscures the sunlight, casting everything below in a perpetual twilight. As you step into the sanctuary, a hushed stillness envelops you, broken only by the occasional rustle of leaves and the distant call of unseen creatures. The air is cool and damp, carrying with it the earthy scent of moss and ferns. Soft tendrils of mist drift lazily through the air, lending an ethereal quality to the surroundings. Here, amidst the tranquil embrace of nature, weary travelers find respite from their journeys, their spirits soothed by the gentle whispers of the forest.',
      price: 150.00,
          },
      {
        ownerId: 1,
        address: 'East of Lunar Valley',
        city: 'Moonreach',
        state: 'Silvercrest',
        country: 'Aetheria',
        lat: 90,
        lng: -102,
        name: 'Moonbeam Haven',
        description: 'Moonbeam Haven, nestled amidst the silver-lit forests of Silvercrest in the ethereal realm of Moonreach, beckons weary travelers with its serene beauty and tranquil atmosphere. As you step into this sanctuary, the soft glow of moonlight bathes everything in a shimmering silver hue, casting enchanting shadows that dance across the verdant landscape. The air is crisp and invigorating, carrying with it the faint scent of pine and wildflowers. Here, amidst the whispering trees and gentle rustle of leaves, time seems to slow, allowing visitors to find solace and rejuvenation in the embrace of nature. Whether you seek a peaceful retreat, a moment of reflection, or simply a respite from the hustle and bustle of everyday life, Moonbeam Haven offers a sanctuary of serenity and harmony beneath the silver-lit skies of Moonreach.',
        price: 150.00
      },
      {
        ownerId: 2,
        address: 'Base of the dormant Pyropeak',
        city: 'Emberfall',
        state: 'Firepeak',
        country: 'Aetheria',
        lat: 80,
        lng: -70,
        name: 'Emberfall Retreat',
        description: 'Ember\'s Edge Retreat, nestled at the base of the dormant volcano, offers a unique haven of tranquility amidst the rugged beauty of the volcanic landscape. Within the inn\'s walls, a sense of calm prevails, with cozy furnishings and warm hearths inviting weary travelers to unwind and relax. Outside, the rugged beauty of the volcanic terrain beckons adventurers to explore its rocky slopes and hidden caverns, while the distant rumble of the volcano serves as a constant reminder of nature\'s awesome power. Whether seeking refuge from the elements or simply a moment of peace amidst the wilderness, Ember\'s Edge Retreat offers a sanctuary of comfort and serenity at the foot of the dormant volcano.',
        price: 50.00
      },
      {
        ownerId: 3,
        address: 'Inside Tempest\'s Edge behind the Stormweave Library',
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
        address: 'In the middle of the Great Sapphire Basin',
        city: 'Serenity Falls',
        state: 'Crystalbrooks',
        country: 'Aetheria',
        lat: 24,
        lng: -123,
        name: 'Serenity Springs Cottage',
        description: 'Serenity Springs Cottage, nestled in the heart of the Great Sapphire Basin in Serenity Falls, Crystalbrooks, exudes a tranquil charm amidst the breathtaking beauty of its surroundings. Surrounded by towering sapphire-hued cliffs that reflect the vibrant blue of the sky above, the cottage sits beside a gentle spring whose waters shimmer with an otherworldly radiance.',
        price: 300.00
          },
      {
              ownerId: 2,
        address: 'On Frostholm\'s peak',
        city: 'Frostholm',
        state: 'Frostwind',
        country: 'Aetheria',
        lat: 30,
        lng: -30,
        name: 'Frostholm Peak Ascent',
        description: 'Frostholm\'s Peak Ascent beckons adventurers to embark on a journey through the icy wilderness of Frostholm, promising a breathtaking reward at its summit. As you set out from the frost-kissed village below, the air is crisp and biting, carrying with it the invigorating scent of pine and snow. The path ahead winds through towering evergreens and across frozen streams, each step bringing you closer to the towering peak that looms above.',
        price: 50.00
          },
      {
          ownerId: 3,
        address: 'Eastern Zephyr Heights',
        city: 'Willowbrook',
        state: 'Verdantvale',
        country: 'Aetheria',
        lat: 70,
        lng: -100,
        name: 'Legends Retreat',
        description: 'Legends Retreat is a serene haven nestled amidst the gentle hills and whispering willows of Zephyr Heights. As you approach the retreat, the air is filled with the soft rustle of leaves and the sweet fragrance of blooming flowers, carried on the gentle zephyrs that sweep through the landscape. The tranquil atmosphere invites visitors to unwind and relax, offering respite from the hustle and bustle of everyday life.',
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
      ownerId: { [Op.in]: [1,2,3,4,5,6]}
    })
  }
};
