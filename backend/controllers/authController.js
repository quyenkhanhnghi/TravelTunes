const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const { CLIENT_RENEG_LIMIT } = require('tls');

const signAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });

const createSendToken = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id, user.role);
  const userId = user._id;
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  user.refreshToken = refreshToken;

  // NOT to run the validator for confirmPassword
  await user.save({ validateModifiedOnly: true });

  const cookieOption = {
    path: '/',
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }
  // SEt access token into header so we can access the protect middeware in authcontroller
  // TODO: check if it work in frontend
  res.setHeader('Authorization', 'Bearer ' + accessToken);
  res.cookie('jwt', refreshToken, cookieOption);
  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  });
};

const refreshToken = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(new AppError('Unauthorized', 401));
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return next(new AppError('Forbidden', 403));

  // Evaluate the refresh token
  const decodeToken = await promisify(jwt.verify)(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // Check if user still exits
  const currentUser = await User.findById(decodeToken.userId).exec();
  if (!currentUser) {
    return next(
      new AppError('The token for this user does no longer exit', 401)
    );
  }
  // Sign new access token
  const accessToken = signAccessToken(currentUser._id, currentUser.role);
  res.status(200).json({
    status: 'success',
    data: {
      user: currentUser,
      accessToken,
    },
  });
});
const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, res);
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
  // Exclude the password
  const currentUser = await User.findOne({ email });
  createSendToken(currentUser, 200, res);
});

//TODO: cannot use in backend due to login not set the bearer token - set in frontend

const protect = catchAsync(async (req, res, next) => {
  // 1. check token exits
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    //TODO: check again the situtation when front end have invalid beared but still have token
    // if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    //   token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please log in to access.', 401));
  }
  // 2. Verify token
  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );
  console.log(decodeToken);

  // 3. Check if user still exits
  const currentUser = await User.findById(decodeToken.userId);
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
  // Grant access to protected route
  req.user = currentUser;
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
    return next(new AppError('Token is invalid or has expired', 400));
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
    return next(new AppError('Invalid password', 400));
  }
  // 3. If yes, update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  // CANNOT use a findbyIDandUpdate. confirmPassword not run for update
  // 4. Log in user. Send JWT token
  createSendToken(user, 200, res);
});
/**
 * Handle sign out
 */
const signOut = catchAsync(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return next(new AppError('No content', 204));

  const refreshToken = cookie.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return next(new AppError('No content', 204));
  }
  foundUser.refreshToken = '';
  const result = await foundUser.save({ validateModifiedOnly: true });
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return next(new AppError('No content', 204));
});
module.exports = {
  signUp,
  login,
  refreshToken,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  signOut,
};
