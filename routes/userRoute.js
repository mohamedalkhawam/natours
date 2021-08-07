const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);
// router
//   .route('/:id')
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser)
//   .get(userController.getOneUser);
module.exports = router;
