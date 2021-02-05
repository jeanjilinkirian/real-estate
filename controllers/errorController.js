const AppError = require('./../utils/appError')

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateKeyErrorDb = err => {
    const message = `Duplicate field value: ${err.keyValue.title}. Please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDb = err => {
    let errors = Object.values(err.errors).map(item => item.message)
    let message = `Invalid Input data: ${errors.join(' ')}`

    return new AppError(message, 400)
}

const handleJWTError = err => {
    return new AppError('Invalid token. Please login again.', 401)
}

const handleJWTExpiredError = err => {
    return new AppError('Your token has expired. Please login again.', 401)
}

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).send({
        status: err.status,
        stack: err.stack,
        message: err.message,
        error: err
    })
}

const sendErrorProd = (err, res) => {
    if(err.isOperational){
        return res.status(err.statusCode).send({
            status: err.status,
            message: err.message
        })
    } else {
        console.error(`ERROR!!`, err)

        return res.status(500).send({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV == 'development'){
        return sendErrorDev(err, res)
    } else if(process.env.NODE_ENV == 'production'){
        let error;
        if(err.kind == 'ObjectId') error = handleCastErrorDb(err)
        if(err.name == 'MongoError' && err.code === 11000) error = handleDuplicateKeyErrorDb(err)
        if(err._message == 'Validation failed') error = handleValidationErrorDb(err)
        if(err.name == 'JsonWebTokenError') error = handleJWTError(err)
        if(err.name == 'TokenExpiredError') error = handleJWTExpiredError(err)

        return sendErrorProd(error, res)
    }
}