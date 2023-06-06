const express = require('express');
const {
  signUp,
  login,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
} = require('../controllers/authController');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.patch('/updateMyPassword', protect, updateMyPassword);
userRouter.patch('/updateMe', protect, updateMe);

userRouter
  .route('/')
  .get(protect, restricTo('admin', 'lead-guide'), getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(protect, restricTo('admin', 'lead-guide'), getUser)
  .patch(protect, restricTo('admin', 'lead-guide'), updateUser)
  .delete(protect, restricTo('admin', 'lead-guide'), deleteUser);

module.exports = userRouter;
