const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



// GET ALL BOOKINGS OF CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    const bookings = await Booking.findAll({
        where: { userId: currentUserId }
    });

    const user = await User.findByPk(currentUserId);

    const bookingsArr = []

    for (const booking of bookings) {
         const spot = await Spot.findByPk(booking.spotId, {
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        })

        const spotImage = await SpotImage.findOne({
            where: {
                spotId: booking.spotId
            }
        });

    if (spotImage) {
        spot.previewImage = spotImage.url;
    } else {
        spot.previewImage = null;
    }

        const response = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: spot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };
        bookingsArr.push(response);
    }
        return res.status(200).json({ Bookings: bookingsArr })
})


module.exports = router;
