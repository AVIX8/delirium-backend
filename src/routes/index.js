const { Router } = require( 'express')
const router = Router()

const search = require('./search.route')
const auth = require('./auth.route')

router.use('/auth', auth)
router.use('/', search)

module.exports = router