const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: reviews,
    requestTime: req.requestTime,
  });
});
exports.setTourIserIds = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  next();
};
exports.createReview = factory.createOne(Review);
exports.getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: review,
    requestTime: req.requestTime,
  });
});
// Do not update passward with this
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
