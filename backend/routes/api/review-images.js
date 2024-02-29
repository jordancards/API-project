const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');

const router = express.Router();

// DELETE A REVIEW IMAGE
router.delete('/:imageId', requireAuth, async (req,res) => {
    let { imageId } = req.params
    let userId = req.user.id

    let reviewImg = await ReviewImage.findByPk(imageId);
    if(!reviewImg){
        return res.status(404).json({ "message": "Review Image couldn't be found" })
    }

    let review = await Review.findByPk(reviewImg.reviewId)
    if(review.userId !== userId){
        return res.status(403).json({'message':'Forbidden'})
    }

    await reviewImg.destroy();
    return res.status(200).json({ "message": "Successfully deleted" })
})


module.exports = router;
