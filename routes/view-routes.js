const express = require('express');

const {
  getOverview,
  getTourBySlug,
  getLoginPage,
  getUserAccount,
  getMyTours,
} = require('../controllers/view-controller');
const { protect, isLoggedIn } = require('../controllers/auth-controller');
const { createBookingCheckout } = require('../controllers/booking-controller');

const router = express.Router();

router.get('/me', protect, getUserAccount);

router.use(isLoggedIn);

router.get('/', createBookingCheckout, getOverview);
router.get('/tour/:slug', getTourBySlug);
router.get('/login', getLoginPage);
router.get('/my-tours', protect, getMyTours);

module.exports = router;
