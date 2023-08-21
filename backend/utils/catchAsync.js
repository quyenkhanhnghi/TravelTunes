const catchAsync = (fn) => (req, res, next) => {
  // fn.catch((err) => next(err));
  fn(req, res, next).catch(next);
};

module.exports = catchAsync;
