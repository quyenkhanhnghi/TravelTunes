const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const ObjectField = (obj, ...allowedFields) => {
  const newObj = {};
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
 * Get all the booking tour from the user
 */
const getMyBookings = catchAsync(async (req, res, next) => {
  // 1. Get all the booking
  const bookings = await Booking.find({ user: req.user.id });
  // 2. Find all tour with the booking id
  const tourIDs = await bookings.map((el) => el.tour._id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: tours,
  });
});
/**
 * Configure multer storage - save to memory
 */
const multerStorage = multer.memoryStorage();
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}.${ext}`);
//   },
// });
/**
 * Configure multer filter
 */
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image', 404), false);
  }
};
/**
 * Configure multer path
 */
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
/**
 * image upload using multer
 */
const uploadUserPhoto = upload.single('photo');
/**
 * Resize user photo
 */
const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
/**
 * User update personal information
 * Authentication
 */
const updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // 1. Create error if user changes password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('You cannot change your password in this page', 400)
    );
  }
  // Fileter out unwatned fileds that not allowed to be updated
  const filteredBody = ObjectField(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // 2. Update user information
  res.status(200).json({
    status: 'success',
    data: user,
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
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
};
