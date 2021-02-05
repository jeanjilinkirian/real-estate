const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Please provide a message to make the contact']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address to make the contact']
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number to make the contact']
    },
    contactDate: {
        type: Date,
        default: Date.now()
    },
    property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        required: [true, 'Property is required for a contact']
    }
}, { toJSON: {virtuals: true}, toObject: {virtuals: true}})

/*contactSchema.pre(/^find/, function(next){
    /*this.populate({
        path: 'property',
        select: 'title address city state'
    })
    next()
})*/

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact