const express = require('express');

const {
  alerts,
  getOverview,
  getTourBySlug,
  getLoginPage,
  getUserAccount,
  getMyTours,
} = require('../controllers/view-controller');
const { protect, isLoggedIn } = require('../controllers/auth-controller');
//const { createBookingCheckout } = require('../controllers/booking-controller');

const router = express.Router();

router.use(alerts);

router.get('/me', protect, getUserAccount);

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTourBySlug);
router.get('/login', getLoginPage);
router.get('/my-tours', protect, getMyTours);

module.exports = router;
