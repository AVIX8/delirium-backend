const { Router } = require( 'express')
const router = Router()

const music = require('./music.route')
const auth = require('./auth.route')

router.use('/auth', auth)
router.use('/music', music)

module.exports = router