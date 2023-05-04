const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({});
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTourBySlug = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  if (!tour) {
    return next(
      new AppError(`Tour with slug ${req.params.slug} was not found`, 404)
    );
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getUserAccount = (req, res) => {
  res.status(200).render('account', {
    title: `${req.user.name.split(' ')[0]}’s Account`,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({
    user: req.user.id,
  });

  const tourIds = bookings.map((el) => el.tour);
  const bookedTours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Booked Tours',
    tours: bookedTours,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert = 'Your booking was successful';
  }
  next();
};
