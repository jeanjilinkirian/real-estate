const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        required: [true, 'A user must have a name'],
        type: String
    },
    description: String,
    email: {
        required: [true, 'A user must have an email'],
        type: String,
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email.'
        }
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'agent'],
        default: 'agent'
    },
    phone: {
        type: String
    },
    isMvp: {
        type: Boolean,
        default: false
    },
    hireDate: {
        type: Date,
        default: Date.now() 
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password length should be minimum 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return this.password === val
            },
            message: 'Passwords are not matching. Please confirm your password again.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew)
        return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.comparePasswords = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    let changedTimeStamp
    if(this.passwordChangedAt){
        changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return changedTimeStamp > JWTTimeStamp
    } else return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 *1000
    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User