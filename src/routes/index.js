const { Router } = require( 'express')
const router = Router()

const music = require('./music.route')
const auth = require('./auth.route')
const user = require('./user.route')

router.use('/music', music)
router.use('/auth', auth)
router.use('/user', user)

module.exports = router