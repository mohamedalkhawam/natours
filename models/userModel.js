const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//name, email photo, password, passwordConfe
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field'],
    trime: true,
    minlength: [3, 'User name must have more than 3 characters'],
    maxlength: [20, 'User name must have less or equal than 20 characters'],
  },
  email: {
    type: String,
    unique: [true, 'Email must be unique'],
    required: [true, 'Email is a required field'],
    trime: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email must be a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is a required field'],
    minlength: [6, 'Password must be more or equal than 6 characters'],
    maxlength: [40, 'password must be less or equal than 40 characters'],
    select: false,
  },
  passwordConfermation: {
    type: String,
    required: [true, 'Password is a required field'],
    minlength: [6, 'Password must be more or equal than 6 characters'],
    maxlength: [40, 'password must be less or equal than 40 characters'],
    validate: function (val) {
      // this only works with SAVE!!
      return val === this.password;
    },
    message: 'Passwords are not the same',
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfermation field
  this.passwordConfermation = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.modified?.('password') || this.isNew()) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatepassword,
  userPassword
) {
  return await bcrypt.compare(candidatepassword, userPassword);
};
userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, { dataBase: this.passwordResetToken });
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
