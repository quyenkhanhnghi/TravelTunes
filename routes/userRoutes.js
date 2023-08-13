const express = require('express');
const {
  signUp,
  login,
  refreshToken,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  signOut,
} = require('../controllers/authController');
const {
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
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.get('/refreshToken', refreshToken);
userRouter.get('/signout', signOut);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updateMyPassword', protect, updateMyPassword);

// Protect all routes after this middleware

userRouter.use(protect);
userRouter.get('/getMe', getMe, getUser);
userRouter.get('/getMyTour', getMe, getUser);
userRouter.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
userRouter.patch('/deleteMe', deleteMe);

userRouter
  .route('/')
  // .get(getAllUsers)
  .get(protect, restricTo('admin', 'lead-guide'), getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(protect, restricTo('admin', 'lead-guide'), getUser)
  .patch(protect, restricTo('admin', 'lead-guide'), updateUser)
  .delete(protect, restricTo('admin', 'lead-guide'), deleteUser);

module.exports = userRouter;
