const Contact = require('./../models/contactModel')
const catchAsync = require('./../utils/catchAsync')

module.exports.createContact = catchAsync(async (req, res, next) => {
    if(!req.body.property)
        req.body.property = req.params.propertyId
    let contact = await Contact.create(req.body)

    res.status(201).send({
        status: 'success',
        data: { contact }
    })
})

module.exports.getAllContacts = catchAsync(async (req, res, next) => {
    let filter = {}
    if(req.params.propertyId)
        filter = { property: req.params.propertyId}

    const contacts = await Contact.find(filter)

    res.status(200).send({
        status: 'success',
        results: contacts.length,
        data: {
            contacts
        }
    })
})

module.exports.getContact = catchAsync(async (req, res, next) => {
    const contact = await Property.findById(req.params.id)

    if(!contact)
        return next(new AppError(`Contact not found`, 404))

    res.status(200).send({
        status: 'success',
        data: { contact }
    })
})

module.exports.deleteContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if(!contact)
        return next(new AppError(`Contact not found`, 404))

    res.status(204).send({
        status: 'success'
    }) 
})