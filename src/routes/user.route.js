const { Router } = require('express')
const {
    likeSong,
    unlikeSong
} = require('../controllers/user.controller')
const { isAuth } = require('../middlewares/auth.middleware')

const router = Router()

router.post('/likeSong', isAuth, likeSong)
router.post('/unlikeSong', isAuth, unlikeSong)

module.exports = router
