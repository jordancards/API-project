const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');

const router = express.Router();


//DELETE A SPOT IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params
    const userId = req.user.id

    const spotImg = await SpotImage.findByPk(imageId, { attributes: ['id', 'spotId', 'url', 'preview'] });

    if (!spotImg) {
        return res.status(404).json({ message: "Spot Image couldn't be found" })
    }

    const spot = await Spot.findByPk(spotImg.spotId)

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    await spotImg.destroy()

    return res.status(200).json({ message: "Successfully deleted" })
})


module.exports = router;
