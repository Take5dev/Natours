const express = require('express');

const {
  getReviews,
  setTourUserIDs,
  getReviewByID,
  createReview,
  updateReviewByID,
  deleteReviewByID,
} = require('../controllers/review-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getReviews)
  .post(restrictTo('user'), setTourUserIDs, createReview);

router
  .route('/:id')
  .get(getReviewByID)
  .patch(restrictTo('user', 'admin'), updateReviewByID)
  .delete(restrictTo('user', 'admin'), deleteReviewByID);

module.exports = router;
