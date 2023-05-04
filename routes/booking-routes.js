const express = require('express');

const {
  getBookings,
  getCheckoutSession,
  createBooking,
  getBookingByID,
  updateBookingByID,
  deleteBookingByID,
} = require('../controllers/booking-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router();

module.exports = router;

router.use(protect);

router.route('/checkout-session/:tourID').get(getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getBookings).post(createBooking);

router
  .route('/:id')
  .get(getBookingByID)
  .patch(updateBookingByID)
  .delete(deleteBookingByID);
