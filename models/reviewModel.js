const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A Review must contain some text'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'A Tour Rating must be >= 1.0'],
      max: [5, 'A Tour Rating must be <= 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A Review must belong to a Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review must belong to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     select: 'name',
//   }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAvgRatings = async function (tour) {
  const stats = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: '$tour',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);

  const tourData =
    stats.length > 0
      ? {
          ratingsQuantity: stats[0].ratingsQuantity,
          ratingsAverage: stats[0].ratingsAverage,
        }
      : {
          ratingsQuantity: 0,
          ratingsAverage: 4.5,
        };

  await Tour.findByIdAndUpdate(tour, tourData);
};

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.r.constructor.calcAvgRatings(this.r.tour);
});

reviewSchema.post('save', function () {
  this.constructor.calcAvgRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
