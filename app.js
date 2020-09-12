const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productsRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productsRoutes)
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status(404)
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app