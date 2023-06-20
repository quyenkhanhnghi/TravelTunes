const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

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

/**
 * Get all users
 * Authorization : Admin
 */
const getAllUsers = factory.getAll(User);

/**
 * Create a new user -please use signup/login instead
 * @param {*} req
 * @param {*} res
 */
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  });
};

/**
 * Get user based on user id
 * Authorization: Admind, leadguide
 */
const getUser = factory.getOne(User);
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'Not yet defined',
//   });
// };

/**
 * Update a user based on the id of the parameter
 * Authorization: Admin
 * MUST NOT UPDATE PASSWORD with this function
 * (findidandupdate will not run again validation for confirmPassword)
 */
const updateUser = factory.updateOne(User);

/**
 * Delete a user based on id from parameters
 * Authorization: Admin
 */
const deleteUser = factory.deleteOne(User);

/**
 * User get personal information
 * Authentication
 */
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
/**
 * User update personal information
 * Authentication
 */
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

/**
 * User deactive
 * Authentication
 */
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
};
