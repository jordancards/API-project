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

//EDIT A BOOKING
router.put('/:bookingId', requireAuth, async (req,res) => {
    const { bookingId } = req.params
    const userId = req.user.id
    const { startDate, endDate } = req.body

    let booking = await Booking.findByPk(bookingId);

    if (!booking) { res.status(404).json({ "message": "Booking couldn't be found" })}

    if (booking.userId !== userId) { res.status(403).json({ 'message': 'Forbidden' }) }

    let currentDate = new Date();
    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)

    if (currentDate > newStartDate) { res.status(400).json({ "message": "startDate cannot be in the past"})
    }

    if (newEndDate <= newStartDate) { res.status(400).json({'message': "endDate cannot be on or before startDate"})
    }

    if (booking.endDate < currentDate) { res.status(403).json({'message': "Past bookings can't be modified"})
    }

    const existingBooking = await Booking.findOne({
        where:{
            id: { [Op.ne]: bookingId },
            spotId: booking.spotId,
            [Op.or]:[
                {startDate : {[Op.between] :[ newStartDate, newEndDate]}},
                {endDate: {[Op.between]: [newStartDate, newEndDate]}},
                {[Op.and]: [{ startDate: { [Op.lte]: newStartDate } },{ endDate: { [Op.gte]: newEndDate } }]}
            ]
        }
    })
    if(existingBooking){
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
          })
    }
    booking.startDate = startDate || booking.startDate
    booking.endDate = endDate || booking.endDate
    await booking.save()

    return res.status(200).json(booking)
})




//DELETE A BOOKING
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params

    // Find the booking
    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }

    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" })
    }

    if (new Date(booking.startDate) <= new Date()) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" })
    }

    await booking.destroy()

    res.json({ message: "Successfully deleted" })
})




module.exports = router;
