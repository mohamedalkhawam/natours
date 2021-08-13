const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// review string rating createdat ref to tou ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [3, 'Review must have at least 3 characters'],
      required: [true, 'Review can not be empty '],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour '],
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'createdBy',
  //     select: 'name photo',
  //   });
  this.populate({
    path: 'createdBy',
    select: 'name photo',
  });
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
