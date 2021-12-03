const express = require('express')
const cors = require('cors')
const app = express()
require('express-ws')(app);
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config()

const routes = require('./routes/index')

// Middlewares
process.env.NODE_ENV == 'development' && app.use(morgan('dev'))

app.use(express.json())
app.use(cors())


// Routes
app.use('/api', routes)

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

module.exports = app
