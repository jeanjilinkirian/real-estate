const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const { Router } = require('express')

const userRouter = express.Router()

userRouter.route('/signup').post(authController.signUp)
userRouter.route('/login').post(authController.logIn)

userRouter.route('/forgotpassword').post(authController.forgotPassword)
userRouter.route('/resetpassword/:token').patch(authController.resetPassword)

userRouter.use(authController.protect)

userRouter.route('/updatemypassword').patch(authController.updatePassword)
userRouter.route('/updateme').patch(userController.updateMe)
userRouter.route('/me').get(userController.getMe, userController.getUser)

userRouter.use(authController.restrictTo('admin'))

userRouter
    .route('/')
    .get(userController.getAllUsers)

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = userRouter