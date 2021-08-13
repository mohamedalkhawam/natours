const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
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
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newReview,
    requestTime: req.requestTime,
  });
});
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
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: review,
    requestTime: req.requestTime,
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
    requestTime: req.requestTime,
  });
});
