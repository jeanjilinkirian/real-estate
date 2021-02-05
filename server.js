process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    process.exit(1)
})

const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({path: './config.env'})

const {app} = require('./app')

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD)
mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
        .then(con => console.log('DB Connection Successful'))

const server = app.listen(process.env.PORT, () => {
    console.log(`Server up listening to the port...`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})