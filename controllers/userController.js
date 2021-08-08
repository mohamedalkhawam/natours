const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTS password dataBase
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.getAllUsers = function (req, res) {
  res.status(200).json({
    status: 'success',
    result: users.length,
  });
};
exports.getOneUser = (req, res) => {
  console.log(req.params);
};
exports.createUser = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    data: { user: 'new user data' },
    requestTime: req.requestTime,
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: 'updated' },
    requestTime: req.requestTime,
  });
};
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
    requestTime: req.requestTime,
  });
};
