const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }
  res.cookie('jwt', token, cookieOption);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  // next();
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

const protect = catchAsync(async (req, res, next) => {
  // 1. check token exits
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('Please log in to access.', 401));
  }
  // 2. Verify token
  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // 3. Check if user still exits
  const currentUser = await User.findById(decodeToken.id);
  if (!currentUser) {
    return next(
      new AppError('The token for this user does no longer exit', 401)
    );
  }
  // 4. check if user chaged password after the token was issued
  if (currentUser.changedPasswordAfter(decodeToken.iat)) {
    return next(
      new AppError('User has changed their password. Please log in again', 401)
    );
  }
  // Grant access too protected route
  req.user = currentUser;
  console.log(req.user);
  next();
});

const restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to execute this action.', 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with email address', 404));
  }
  // 2. Generate random reset token
  const resetToken = user.createPasswordResetToken();
  // parse option check false so not validate again
  await user.save({ validateBeforeSave: false });
  // 3. Send to user's email address
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot Password? Submit new password to ${resetURL}. If you do not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset valid for 10 min',
      message,
    });
    res.json({
      status: 'success',
      message: 'Sent reset password to your email address',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExprises = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('Could not send reset password to email address', 500)
    );
  }
});
const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const harshToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: harshToken,
    passwordResetExprises: { $gt: Date.now() },
  });
  // 2. If token has not expired and have a user then set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired'), 400);
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExprises = undefined;
  await user.save();
  // 3. Update changedPasswordAt property for a user
  // use middleware MoongoDb to update password
  // 4. Log in user. Send JWT token
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

/**
 * User update password for themself
 * Have to login first
 */
const updateMyPassword = catchAsync(async (req, res, next) => {
  // 1. Get user from database
  const user = await User.findById(req.user.id).select('+password');
  // 2. Check if post current password is correct
  if (!(await user.checkPassword(req.body.currentPassword))) {
    return next(new AppError('Invalid password'), 400);
  }
  // 3. If yes, update password
  console.log(user.passwordChangedAt);
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  console.log(user.passwordChangedAt);
  // CANNOT use a findbyIDandUpdate. confirmPassword not run for update
  // 4. Log in user. Send JWT token
  createSendToken(user, 200, res);
});
module.exports = {
  signUp,
  login,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
};
