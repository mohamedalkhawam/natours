const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
// router.param('id', tourController.checkId);
const authController = require('../controllers/authController');
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
  .get(authController.protect, tourController.getAllTours)
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
