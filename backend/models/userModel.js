const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please enter your password'],
    minlength: 8,
    select: false,
  },
  // create into a virtual property ? - not needed to save in database
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // only work for Create and Save operations (not for Update - use save instead)
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExprises: Date,
  // Add to save the refresh token for front-end
  refreshToken: String,
});

/**
 * Update changedPasswordAt property
 */
userSchema.pre('save', function (next) {
  // Only run this func if the password is modified or new user
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  // make sure that token is issued before changing password
  this.passwordChangedAt = Date.now() - 1000;
  console.log(this.passwordChangedAt);
  console.log(Date.now() - 1000);
  next();
});

/**
 * Harsh password for the current user
 */
userSchema.pre('save', async function (next) {
  // Set the environment variable to turn off password encryption
  // when import data from json file
  if (process.env.NODE_ENV === 'LOADER') {
    this.isNew = true;
    return next();
  }
  // only run this func if the password is modified
  if (!this.isModified('password')) {
    return next();
  }
  // hash passwrod with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete password confirmation
  this.confirmPassword = undefined;
  next();
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password password of user
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Check if user has changed password before the token is issued
 * @param {*} JWTTimestamp the token's time is issued
 * @returns true if user has changed password before the token is issued, false otherwise
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

/**
 * Create a password reset token for forgot password user
 * @returns a reset token to compare / save in database the harsh resettoken
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  // modify only - not save yet -> save in controller
  this.passwordResetExprises = Date.now() + 10 * 60 * 1000;

  //return to send to email of the user
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
