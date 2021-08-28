const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoute');
const authController = require('../controllers/authController');
//POST /tour/5156151/reviews
//GET /tour/5156151/reviews
//GET /tour/5156151/reviews/5454545

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.aliasTopTours,
    tourController.getAllTours
  );
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, tourController.createTour);
// tourController.checkBody,
router
  .route('/:id')
  .get(authController.protect, tourController.getOneTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
