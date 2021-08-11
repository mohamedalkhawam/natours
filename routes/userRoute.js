const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(authController.protect, userController.createUser);
router
  .route('/:id')
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser)
  .get(authController.protect, userController.getOneUser);
module.exports = router;
