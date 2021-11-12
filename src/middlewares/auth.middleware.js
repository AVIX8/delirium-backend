const jwt = require('jsonwebtoken')

module.exports.isAuth = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization?.split(' ')?.[1]
        if (!token) {
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodedData
        next()
    } catch (e) {
        // console.log(e)
        e //?
        return res.status(401).json({message: "Пользователь не авторизован"})
    }
}
