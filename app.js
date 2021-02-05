const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')

const propertyRouter = require(`${__dirname}/routes/propertyRoutes`)
const userRouter = require(`${__dirname}/routes/userRoutes`)
const contactRouter = require(`${__dirname}/routes/contactRoutes`)
const AppError = require(`${__dirname}/utils/appError`)
const globalErrorHandler = require(`${__dirname}/controllers/errorController`)

const app = express()

app.use(helmet())

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP. Try again in an hour.'
})

app.use('/api', limiter)


app.use(express.json({
    limit: '10kb'
}))

app.use(mongoSanitize())

app.use(xss())

app.use(hpp({
    whitelist: ['title', 'address', 'city', 'state', 'zipCode', 'price', 'bedrooms', 'bathrooms', 'garage', 'sqft', 'lot_size', 'name', 'email']
}))

if(process.env.NODE_ENV == 'development')
    app.use(morgan('dev'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)
app.use('/api/v1/contacts', contactRouter)

app.all('*', (req, res, next) => {
    let error = new AppError(`Can't find ${req.url} in the server`, 404)
    next(error)
})

app.use(globalErrorHandler)

module.exports.app = app