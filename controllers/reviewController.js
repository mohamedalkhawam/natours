const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review)
exports.createReview = factory.createOne(Review);
exports.getOneReview = factory.getOne(Review)
// Do not update password with this
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.setTourInUserIds = (req, res, next) => {
  if (!req.body.createdBy) {
    req.body.createdBy = req.user.id;
  }
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  next();
};