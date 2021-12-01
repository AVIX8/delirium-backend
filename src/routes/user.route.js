const { Router } = require('express')
const {
    setName,
    likeSong,
    unlikeSong
} = require('../controllers/user.controller')
const { isAuth } = require('../middlewares/auth.middleware')

const router = Router()

router.post('/setName', isAuth, setName)
router.post('/likeSong', isAuth, likeSong)
router.post('/unlikeSong', isAuth, unlikeSong)

module.exports = router
