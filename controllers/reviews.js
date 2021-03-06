const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Reviews = require('../models/Reviews');
const Bootcamp = require('../models/Bootcamp');

//@desc     Get reviews
//@route    Get /api/ v1/ reviews
//@route    Get /api/ v1/ bootcamps/:bootcampId/reviews
//@access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Reviews.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc     Get single review
//@route    Get /api/ v1/ reviews/:id
//@access   Public
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Reviews.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`), 404);
    }
    res.status(200).json({
        success: true,
        data: review
    });
});
//@desc     Add single review
//@route    Post /api/ v1/ bootcamps/:bootcampId/reviews
//@access   Private
exports.addReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`, 404));
    }

    const review = await Reviews.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});