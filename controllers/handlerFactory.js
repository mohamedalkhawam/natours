const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter;
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const data = await features.query;
        res.status(200).json({
            status: 'success',
            result: data.length,
            data: data,
            requestTime: req.requestTime,
        });
    });
exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) {
            query.populate(popOptions);
        }
        const data = await query;
        if (!data) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            result: 1,
            data: data,
            requestTime: req.requestTime,
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const data = await Model.create(req.body);
        console.log(req.requestTime);
        res.status(201).json({
            status: 'success',
            data,
            requestTime: req.requestTime,
        });
    });
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!data) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data,
            requestTime: req.requestTime,
        });
    });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
      requestTime: req.requestTime,
    });
  });



