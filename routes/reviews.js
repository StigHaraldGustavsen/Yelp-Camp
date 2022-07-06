const express = require('express');
const router = express.Router({mergeParams: true});
const Reviews = require('../controllers/reviews')

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const{isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(Reviews.createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(Reviews.deleteReview))

module.exports = router;