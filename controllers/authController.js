const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const crypto = require('crypto')

const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken = id => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN})

}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    })

    user.password = undefined
    
    res.status(statusCode).send({
        status: 'success',
        token,
        data: { user }
    })
}

module.exports.signUp = catchAsync(async (req, res, next) => {
    const {name, email, password, passwordConfirm, phone, photo, isMvp, hireDate, passwordChangedAt, role } = req.body 
    
    const newUser = await User.create({
        name, password, passwordConfirm, email, phone, photo, isMvp, hireDate, passwordChangedAt, role
    })

    createSendToken(newUser, 201, res)
})

module.exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password)
        return next(new AppError('Please provide email and password', 400))

    let user = await User.findOne({ email }).select('+password')
    if(!user)
        return next(new AppError('Invalid credentials. Please provide the correct email/password', 401))

    const correct = await user.comparePasswords(password, user.password)

    if(!correct)
        return next(new AppError('Invalid credentials. Please provide the correct email/password', 401))

    createSendToken(user, 200, res)
})

module.exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1]

    if(!token)
        return next(new AppError('You are not logged in. Please log in to get access.', 401))
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded._id)
    if(!user)
        return next(new AppError('The user belonging to this token does no longer exist', 401))

    if(user.changedPasswordAfter(decoded.iat))
        return next(new AppError('Password was changed. Please login again', 401))
    
    req.user = user
    next()
})

module.exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('Permission Denied.', 403))
        next()
    }
}

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email
    
    if(!email)
        return next(new AppError('Please provide your email address', 400))

    const user = await User.findOne({email})
    if(!user)
        return next(new AppError('User does not exist. Please provide an existing user email', 404))

    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
    const message = `Forgot your password? Sumbit a request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token(valid for 10 minutes)',
            message
        })
        
        res.status(200).send({
            status: 'success',
            message: 'Token sent to mail'
        })
    } catch(e){
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError('There was an error sending an email. Try again later', 500))
    }
})

module.exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    if(!user)
        return next(new AppError('Token invalid or expired.', 400))

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    createSendToken(user, 200, res)
})


module.exports.updatePassword = catchAsync(async (req, res, next) => {
    let user = await User.findById(req.user._id).select('+password')
    
    if(!await user.comparePasswords(req.body.passwordCurrent, user.password))
        return next(new AppError('Your current password is wrong. Please provide your password', 401))

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    createSendToken(user, 200, res)

    res.status(200).send({
        status:'success'
    })
})