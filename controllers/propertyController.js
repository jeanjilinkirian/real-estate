const Property = require('./../models/propertyModel')
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const AppError = require(`${__dirname}/../utils/appError`)

const fs = require('fs')

module.exports.getAllProperties = catchAsync(async (req, res, next) => {
    var features = new APIFeatures(Property.find(), req.query).filter().sort().limitFields().paginate()
    const properties = await features.query
    
    res.status(200).send({
        status: 'success',
        results: properties.length,
        data: { properties }
    })
})

module.exports.getProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findById(req.params.id).populate('contacts').populate({ path: 'agent', select: 'name email -_id'})

    if(!property)
        return next(new AppError(`Property not found`, 404))

    res.status(200).send({
        status: 'success',
        data: { property }
    })
})

module.exports.createProperty = catchAsync(async (req, res, next) => {
    const property = await Property.create(req.body)
    
    return res.status(201).send({
        status: 'success',
        data: {
            property
        }
    })
})

module.exports.updateProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if(!property)
        return next(new AppError(`Property not found`, 404))

    res.status(200).send({
        status: 'success',
        data: { property }
    }) 
})

module.exports.deleteProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findByIdAndDelete(req.params.id)

    if(!property)
        return next(new AppError(`Property not found`, 404))

    res.status(204).send({
        status: 'success'
    }) 
})