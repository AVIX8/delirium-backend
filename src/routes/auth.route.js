const { Router } = require('express')
const {
    user,
    register,
    login,
    logout,
    refresh
} = require('../controllers/auth.controller')
const { isAuth } = require('../middlewares/auth.middleware')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.get('/user', isAuth, user)
router.post('/logout', logout)

module.exports = router
