const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

const routes = require('./routes/index')

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())


// Routes
app.use('/api', routes)

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

module.exports = app
