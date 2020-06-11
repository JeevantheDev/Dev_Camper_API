const express = require('express');
const { 
    getReviews,
    getReview, 
    addReview
} = require('../controllers/reviews');

const Reviews = require('../models/Reviews');
const advancedResults = require('../middleware/advancedResults');

const {protect, authorize} = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(Reviews, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect,authorize('user', 'admin'), addReview);
    
router
    .route('/:id')
    .get(getReview)

    

module.exports = router;