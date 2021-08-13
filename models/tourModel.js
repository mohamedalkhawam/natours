const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      unique: [true, 'Tour name must be unique'],
      trim: true,
      minlength: [
        10,
        'A tour name must have more or equal than 10 characters ',
      ],
      maxlength: [
        40,
        'A tour name must have less or equal than 40 characters ',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour Price is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this function will not work on update; but only on create
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) shoul  be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      // lat, lng
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //child ref
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // reviews: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Review',
    // },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// this is virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//DOCUMENT MIDDLEWARE: RUNS BEFORE .SAVE() AND .CREATE()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// embadding guide into tours
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//QUERY MIDDLEWARE:

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTours: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});
//Aggregation MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTours: { $ne: true } },
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
