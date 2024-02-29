const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



const validateReviews = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
    check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]



// GET ALL REVIEWS BASED ON CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id

    const reviews = await Review.findAll({
        where: { userId: currentUserId },
        include: [
            { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], required: false },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    })

    const user = await User.findByPk(currentUserId)

    const reviewArr = reviews.map(review => ({
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: user,
        Spot: review.Spot || { dataValues: { previewImage: 'No Images' } },
        ReviewImages: review.ReviewImages
    }))

    return res.status(200).json({ Reviews: reviewArr })
})



//DELETE A REVIEW
router.delete('/:reviewId', requireAuth, async (req, res) => {
    let { reviewId } = req.params
    let review = await Review.findByPk(reviewId)

    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (req.user.id !== review.userId) {
        return res.status(403).json({ message: "Forbidden" })
    }

    await review.destroy()
    return res.status(200).json({ message: "Successfully deleted" })
})



//ADD AN IMAGE TO REVIEW BASED ON REVIEW ID
router.post('/:reviewId/images', requireAuth, async (req,res) => {
    let { reviewId } = req.params
    let currentUserId = req.user.id
    let { url, preview } = req.body

    let review = await Review.findByPk(reviewId)

    if (!review) {
        return res.status(404).json({"message": "Review couldn't be found"})
    }
    if(review.userId !== currentUserId){
        return res.status(403).json({"message": "Forbidden"})
    }
    let imgCount = await ReviewImage.count({
        where: {
            reviewId : reviewId
        }
    })
    if(imgCount >= 10){
        return res.status(403).json({ "message": "Maximum number of images for this resource was reached" })
    }

    let newReviewImg = await ReviewImage.create({ reviewId: reviewId, url, preview })

    let response = {
        id: newReviewImg.id,
        url: newReviewImg.url
    }
    return res.status(200).json(response)
})



//EDIT REVIEW
router.put('/:reviewId', requireAuth, validateReviews, async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user.id
    let { review, stars } = req.body

    const updatedReview = await Review.findByPk(reviewId)

    if (!updatedReview) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }

    if (updatedReview.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" })
    }

    if (review !== undefined) {
        updatedReview.review = review
}
    if (stars !== undefined) {
        updatedReview.stars = stars
}

await updatedReview.save()

    return res.status(200).json(updatedReview)
})



module.exports = router;
