const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
    requestTime: req.requestTime,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfermation: req.body.passwordConfermation,
  });
  createSendToken(newUser, 201, res, req);
});
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)- Check of email and password are exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!!', 400));
  }
  // 2)- Check if user exists && password is correct
  //sence we stopped the password from being selected with getting user Data, to get it back just in this case i add the select(+the property name )
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //   console.log(user);
  // 3)- If everything ok, send token to client
  createSendToken(user, 200, res, req);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting the token and check of it's there
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (req.headers.token) {
    token = req.headers.token;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (await currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //i could get the user role from user object because the protect function  is running before this function, and in the protect function i said that re.user = currentUser so i have access to the user object
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address'));
  }
  // 2) Generate new token
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });
  // 3) send it back to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH with your new password and passwordConfirmation
   to:${resetURL}. \n If you did not forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email, Try again later!!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    console.log(user);
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfermation = req.body.passwordConfermation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res, req);
  // 3) Update changedPasswordAt property for user
  // 4) Log the user in, send jwt
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (
    !(await user.correctPassword(req.body.currentPassword ?? '', user.password))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }
  //   console.log(user);
  // 3)- If everything ok, send token to client
  user.password = req.body.password;
  user.passwordConfermation = req.body.passwordConfermation;
  await user.save();
  createSendToken(user, 200, res, req);
  // 1) Get user from collection
  // 2) Check if POSTED current password is currect
  // 3) if so, update password
  // 4) log user in, send jwt
});
