const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const User = require('./../models/userModel')

const filterObj = (obj, ...allowedFields) => {
    let filtered = {}
    Object.keys(obj).forEach(key => {
        if(allowedFields.includes(key)){
            filtered[key] = obj[key]
        }
    })
    return filtered
}

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
    
    res.status(200).send({
        status: 'success',
        results: users.length,
        data: { users }
    })
})

module.exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user)
        return next(new AppError(`User not found`, 404))

    res.status(200).send({
        status: 'success',
        data: { user }
    })
})

module.exports.updateUser = catchAsync(async (req, res, next) => {
    if(req.body.passowrd || req.body.passwordConfirm)
        return next(new AppError('This route is not for password updates', 400))

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if(!user)
        return next(new AppError(`User not found`, 404))

    res.status(200).send({
        status: 'success',
        data: { user }
    }) 
})

module.exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if(!user)
        return next(new AppError(`User not found`, 404))

    res.status(204).send({
        status: 'success'
    }) 
})

module.exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.passowrd || req.body.passwordConfirm)
        return next(new AppError('This route is not for password updates', 400))

    const filteredBody = filterObj(req.body, 'name', 'email')
    console.log(req.body)
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, { runValidators: true, new: true })

    return res.status(200).send({
        status: 'success',
        user
    })   
})

module.exports.getMe = (req, res, next) => {
    req.params.id = req.user._id
    next()
}