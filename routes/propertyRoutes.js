const express = require('express')
const propertyController = require('./../controllers/propertyController')
const authController = require('./../controllers/authController')
const contactRouter = require('./../routes/contactRoutes')

const propertyRouter = express.Router()

propertyRouter.use('/:propertyId/contacts', contactRouter)

propertyRouter
    .route('/')
    .get(propertyController.getAllProperties)
    .post(authController.protect, authController.restrictTo('admin'), propertyController.createProperty)

propertyRouter
    .route('/:id')
    .get(propertyController.getProperty)
    .patch(authController.protect, authController.restrictTo('admin'), propertyController.updateProperty)
    .delete(authController.protect, authController.restrictTo('admin'), propertyController.deleteProperty)
    
module.exports = propertyRouter