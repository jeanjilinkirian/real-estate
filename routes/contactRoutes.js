const express = require('express')
const contactController = require('./../controllers/contactController')
const authController = require('./../controllers/authController')

const contactRouter = express.Router({ mergeParams: true})

contactRouter
    .route('/')
    .get(authController.protect, contactController.getAllContacts)
    .post(contactController.createContact)

contactRouter
    .route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), contactController.getContact)
    .delete(authController.protect, authController.restrictTo('admin'), contactController.deleteContact)

module.exports = contactRouter