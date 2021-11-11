const express = require('express')
const app = express()

const routes = require('./routes/index')

// Middlewares
app.use(express.json())



// Routes
app.use('/api', routes)

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

module.exports = app
