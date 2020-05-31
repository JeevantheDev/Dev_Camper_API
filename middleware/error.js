const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    //Mongoose bad object id
    if(err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose Duplicate key
    if(err.code === 11000) {
        const message = 'Duplicate fieldvalue entered';
        error = new ErrorResponse(message, 400);
    }
    //mongoose Validation error
    if(err.name == 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

module.exports = errorHandler;