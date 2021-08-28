const express = require('express');
const router = express.Router({
  mergeParams: true,
});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.setTourIserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(authController.protect, reviewController.getOneReview)
  .patch(authController.protect, reviewController.updateReview)
  .delete(
    authController.protect,
    // authController.restrictTo('admin'),
    reviewController.deleteReview
  );
module.exports = router;
