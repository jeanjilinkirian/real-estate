const mongoose = require('mongoose')
const slugify = require('slugify')

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A property must have a title'],
        trim: true,
        unique: true,
        maxlength: [60, 'A Property title must have a maximum of 60 charactes'],
        minlength: [10, 'A Property title must have a minimum of 10 characters']
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'A property must have an address'],
        maxlength: [100, 'A Property address must have a maximum of 100 charactes'],
        minlength: [10, 'A Property address must have a minimum of 10 characters']
    },
    city: {
        type: String,
        trim: true,
        required: [true, 'A property must have a city'],
        maxlength: [20, 'A Property city must have a maximum of 100 charactes'],
        minlength: [3, 'A Property city must have a minimum of 3 characters']
    },
    state: {
        type: String,
        trim: true,
        required: [true, 'A property must have a state']
    },
    zipCode: {
        type: String,
        default: "0000"
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'A property must have a price']
    },
    bedrooms: {
        type: Number,
        min: 1
    },
    bathrooms: {
        type: Number,
        min: 1 
    },
    garage: {
        type: Number,
        default: 0
    },
    sqft: {
        type: Number,
        required: [true, 'A property must have an area']
    },
    lot_size: Number,
    isPublished: {
        type: Boolean,
        default: true
    },
    listDate: {
        type: Date,
        default: Date.now(),
    },
    photoMain: {
        type: String,
        required: [true, 'A property must have a main photo']
    },
    photos: [String],
    slug: String,
    agent: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})

propertySchema.index({ price: 1, sqft: -1, city: 1})
propertySchema.index({slug: 1})

propertySchema.virtual('squaremtr').get(function(){
    return Number((this.sqft*0.092).toFixed(1))
})

propertySchema.virtual('contacts', {
    ref: 'Contact',
    foreignField: 'property',
    localField: '_id'
})

propertySchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true })
    next()
})

const Property = mongoose.model('Property', propertySchema)

module.exports = Property