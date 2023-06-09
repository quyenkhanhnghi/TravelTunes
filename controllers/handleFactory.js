const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`${doc} not found`, 404));
    }
    res.status(204).json({
      status: 'Sucessful delete',
      data: null,
    });
  });
