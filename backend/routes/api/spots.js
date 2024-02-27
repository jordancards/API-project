const express = require('express');
const { Sequelize } = require('sequelize')
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();



module.exports = router
