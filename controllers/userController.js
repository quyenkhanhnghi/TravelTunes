const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const ObjectField = (obj, ...allowedFields) => {
  let newObj;
  // obj = [name: 1, email: 2, df: 3]
  // allowedField = email, name
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: 'success',
    data: users,
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

// for user to update his personal information
const updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user changes password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('You cannot change your password in this page', 400)
    );
  }
  const allowedFields = ['name', 'email'];
  const user = await User.findByIdAndUpdate(
    req.user.id,
    ObjectField(req.body, allowedFields),
    {
      runValidators: true,
    }
  );
  // 2. Update user information
  res.status(200).json({
    status: 'success',
    data: user.sendRes,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
};
