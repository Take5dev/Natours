const express = require('express');

const {
  checkTourID,
  aliasTopFiveTours,
  getTours,
  createTour,
  getTourByID,
  updateTourByID,
  deleteTourByID,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tour-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');
const reviewRouter = require('./review-routes');

const router = express.Router();

//router.param('id', checkID);

router.param('tourId', checkTourID);
router.use('/:tourId/reviews', reviewRouter);

router.route('/top5').get(aliasTopFiveTours, getTours);
router.route('/stats').get(getTourStats);
router
  .route('/plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route([
    '/within/:distance/center/:latlng',
    '/within/:distance/center/:latlng/unit/:unit',
  ])
  .get(getToursWithin);

router
  .route(['/distances/:latlng', '/distances/:latlng/unit/:unit'])
  .get(getDistances);

router
  .route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTourByID)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTourByID
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTourByID);

module.exports = router;
