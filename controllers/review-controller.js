const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.setTourUserIDs = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  } else if (!(await Tour.findById(req.body.tour))) {
    return next(new AppError(`No Tour found with ID ${req.body.tour}`, 404));
  }
  next();
});

exports.getReviews = factory.getAll(Review, { checkTourID: true });
exports.getReviewByID = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReviewByID = factory.deleteOne(Review);
exports.updateReviewByID = factory.updateOne(Review);
