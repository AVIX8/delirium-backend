const { Router } = require( 'express')
const router = Router()

const search = require('./search.route')

router.use('/', search)

module.exports = router