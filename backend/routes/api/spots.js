const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

const validateSpots = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

//GET ALL SPOTS
router.get('/', async (req,res) => {

    let {minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let queryObj = {
        where: {}
    }

    const spots = await Spot.findAll({...queryObj})
    let spotArr = []
    for(let spot of spots){
    const reviews = await Review.findAll({
         where: {
            spotId: spot.id
        }
    });

    let stars = 0;
    reviews.forEach(review => {
        stars += review.stars;
    })
    let avgRating = "No Rating Yet"
    if (reviews.length > 0) {
        avgRating = parseFloat((stars / reviews.length).toFixed(1))
    }
    spot.dataValues.avgRating = avgRating


    const previewImg = await SpotImage.findOne({
        where: {
         spotId: spot.id
        }
        })
        if(!previewImg){
            spot.dataValues.previewImage = 'No Images Yet'
        }
        else{
            spot.dataValues.previewImage = previewImg.url
        }

    const response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        avgRating: spot.dataValues.avgRating,
        previewImage : spot.dataValues.previewImage
     }
        spotArr.push(response)
    }
    return res.status(200).json({Spots: spotArr})
})



// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;
    const spots = await Spot.findAll({
        where: { ownerId: currentUserId }
    });

    const spotArr = [];
    for (const spot of spots) {
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    let avgRating = 0;
        reviews.forEach(review => {
            avgRating += review.stars;
        });
        avgRating = avgRating / reviews.length || 0;

        spot.dataValues.avgRating = parseFloat(avgRating.toFixed(1)) || 'No Rating Yet';

    const prevImg = await SpotImage.findOne({ where: { spotId: spot.id } });
        spot.dataValues.previewImage = prevImg ? prevImg.url : null;

    const response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.dataValues.avgRating,
        previewImage: spot.dataValues.previewImage
     };
        spotArr.push(response);
    }
        return res.status(200).json({ Spots: spotArr });
});



//GET DETAILS OF SPOTS BY ID
router.get('/:spotId', async (req,res) => {
    let { spotId } = req.params;
    let spot = await Spot.findByPk(spotId)

    if(!spot){
        res.status(404)
        return res.json({ "message": "Spot couldn't be found" })
    }

    let reviews = await Review.findAll({
        where: {
            spotId: spot.id
        }
    })

    spot.dataValues.numReviews = reviews.length;
    let avgRating = 0;
    if (reviews.length > 0) {
        reviews.forEach(review => {
            avgRating += review.stars;
    });
        avgRating /= reviews.length;
        spot.dataValues.avgRating = parseFloat(avgRating.toFixed(1));
    } else {
        spot.dataValues.avgRating = 'No Rating Yet';
    }

    let spotImgs = await SpotImage.findAll({
        where: {
            spotId: spot.id
        },
        attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt'],
      },
    })
    let owner = await User.findOne({
        where: {
            id : spot.ownerId
        },
        attributes: ['id','firstName','lastName']
    })

    const response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.dataValues.numReviews,
        avgStarRating: spot.dataValues.avgRating,
        SpotImages: spotImgs,
        Owner: owner
    }
    return res.status(200).json(response)
})



//CREATE A SPOT
router.post('/', async (req, res) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    let response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city:spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price:parseFloat(spot.price)
    }
    return res.status(201).json(response)
})



//ADD IMAGE TO SPOT BASED ON SPOT'S ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (req.user.id !== review.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const imgCount = await ReviewImage.count({ where: { reviewId: reviewId } });

    if (imgCount >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    const newRevImg = await ReviewImage.create({ reviewId: reviewId, url });

    res.json({ id: newRevImg.id, url: newRevImg.url });
});

//CREATE SPOT
router.post('/', requireAuth, validateSpots, async (req, res) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body;
    let UserId = req.user.id
    const spot = await Spot.create({
        ownerId: UserId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    let response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city:spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price:parseFloat(spot.price)
    }
    return res.status(201).json(response)
})



//EDIT A SPOT
 router.put('/:spotId', requireAuth, validateSpots, async (req, res) => {
    const spotId = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

     if (!spot) {
         return res.status(404).json({ message: "Spot couldn't be found" });
     }

     if (req.user.id !== spot.ownerId) {
         return res.status(403).json({ message: "Forbidden" });
    }

    await spot.update({
        address: address || spot.address,
        city: city || spot.city,
        state: state || spot.state,
        country: country || spot.country,
        lat: lat || spot.lat,
        lng: lng || spot.lng,
        name: name || spot.name,
        description: description || spot.description,
        price: price || spot.price
    });

    res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        ...spot.toJSON()
    });
 });



//DELETE A SPOT
router.delete('/:spotId', requireAuth, async (req, res) => {
    let { spotId } = req.params;
    let spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: 'Spot couldn\'t be found' })
    };

    if (req.user.id !== spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' })
    };

    await spot.destroy();
    return res.status(200).json({ message: 'Successfully deleted' })
});



//GET ALL REVIEWS BY A SPOTS ID
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const allReviews = await Review.findAll({
        where: { spotId: spotId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    })

    res.json({ Reviews: allReviews })
})



//CREATE A REVIEW BASED ON SPOTS ID
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body
    const { spotId } = req.params

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }

    const reviewCount = await Review.count({
        where: {
            userId: req.user.id,
            spotId: spotId
        }
    });

    if (reviewCount > 0) {
        return res.status(409).json({ message: "User already has a review for this spot" })
    }

    const newReview = await Review.create({
        spotId: parseInt(spotId),
        userId: req.user.id,
        review,
        stars
    });

    res.status(201).json(newReview)
});

module.exports = router;
