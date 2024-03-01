const express = require('express');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const { check, validationResult, query } = require('express-validator');
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

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

const QueryFilters = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Maximum latitude is invalid"),
    check('minLat')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Minimum latitude is invalid"),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Maximum longitude is invalid"),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Minimum longitude is invalid"),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]




//GET ALL SPOTS
router.get('/', QueryFilters, async (req,res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let queryObj = {
        where: {}
    }

    const pageNumber = parseInt(page)
    const pageSize = parseInt(size)

    if(!page || (parseInt(page) == NaN)) page = 1
    if(!size || (parseInt(size) == NaN)) size = 20

    queryObj.limit = size
    queryObj.offset = size * (page - 1)

    if (minLat) queryObj.where.lat = { [Op.gte]: parseFloat(minLat) }
    if (maxLat) queryObj.where.lat = { [Op.lte]: parseFloat(maxLat) }
    if (minLng) queryObj.where.lng = { [Op.gte]: parseFloat(minLng) }
    if (maxLng) queryObj.where.lng = { [Op.lte]: parseFloat(maxLng) }
    if (minPrice) queryObj.where.price = { [Op.gte]: parseFloat(minPrice) }
    if (maxPrice) queryObj.where.price = { [Op.lte]: parseFloat(maxPrice) }

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
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.dataValues.avgRating,
        previewImage : spot.dataValues.previewImage
     }
        spotArr.push(response)
    }
    page = parseInt(page)
    size = parseInt(size)
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
router.post('/', requireAuth, validateSpots, async (req, res) => {
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
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
    }
    return res.status(201).json(response)
})



//ADD IMAGE TO SPOT BASED ON SPOT'S ID
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body

    const spotId = await Spot.findByPk(req.params.spotId)

    if (!spotId) {
        return res.status(404).json({
            message: "Spot couldn't be found"})
    }

    if (req.user.id !== spotId.ownerId) {
        return res.status(403).json({ message: "Forbidden"})
    }

    const spotImage = await SpotImage.create({
        spotId: req.params.spotId,
        url,
        preview,
    })

    res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    })
})



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
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
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



//GET ALL BOOKINGS IN SPOTS ID
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params
    const currentUserId = req.user.id

    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== currentUserId) {

        const notOwnerBookings = await Booking.findAll({
            where: { spotId: spot.id },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.status(200).json({ Bookings: notOwnerBookings })
    }

    const ownerBookings = await Booking.findAll({
        where: { spotId: spot.id },
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
    })
    return res.status(200).json({ Bookings: ownerBookings })
})



//CREATE A BOOKING BASED ON SPOTS ID
router.post('/:spotId/bookings', requireAuth, async(req,res) => {
    const  { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    let spot = await Spot.findByPk(spotId)

    if (!spot) { return res.status(404).json({ "message": "Spot couldn't be found" }) }

    if(spot.ownerId == userId) {return res.status(403).json({'message':'Forbidden'})}

    let currentDate = new Date();
    let newStartDate = new Date(startDate);
    let newEndDate = new Date(endDate);

        if(currentDate > newStartDate){
            return res.status(400).json({
                "message": "Bad Request",
                "errors": { "startDate": "startDate cannot be in the past"}
              })
        }
        if(newEndDate <= newStartDate){
            return res.status(400).json({
                "message": "Bad Request",
                "errors": { "endDate": "endDate cannot be on or before startDate" }
              })
        }

        const existingBooking = await Booking.findOne({
            where:{
                spotId: spotId,
                [Op.or]: [
                    {startDate: { [Op.between]: [newStartDate, newEndDate] }},
                    {endDate: { [Op.between]: [newStartDate, newEndDate] }},
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
        let createdBooking = await Booking.create({ userId: userId, spotId: spotId, startDate, endDate })
        const response = {
            id: createdBooking.id,
            spotId: createdBooking.spotId,
            userId: createdBooking.userId,
            startDate: createdBooking.startDate,
            endDate: createdBooking.endDate,
            createdAt: createdBooking.createdAt,
            updatedAt: createdBooking.updatedAt
        }
        return res.status(200).json(response)
})

module.exports = router;
