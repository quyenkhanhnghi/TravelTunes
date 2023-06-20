const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Features = require('../utils/apiFeature');

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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`${doc} not found`, 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    // same:
    // Tour.findById({ _id: req.params.id })
    if (!doc) {
      return next(new AppError(`${doc} not found`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Allow nested GET reviews on specific tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Execute query
    const featuresAPI = new Features(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const docs = await featuresAPI.query;
    //  3. Send response
    res.status(200).json({
      status: 'success',
      length: docs.length,
      data: docs,
    });
  });
