const User = require('../models/User')
const Session = require('../models/Session')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const uuidv4 = require('uuid').v4

const { registerValidation, loginValidation } = require('../validation/user.validation')

const messages = require('../messages.js')

const issueAccessToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '12h',
    })

const issueRefreshToken = (user) =>
    jwt.sign({ id: user._id, u: uuidv4() }, process.env.JWT_SECRET_KEY, {
        expiresIn: '35d',
    })

module.exports.user = async (req, res) => {
    let user = await User.findById(req.user.id)
    user.password = undefined
    return res.send({ user })
}

module.exports.register = async (req, res) => {
    const { error } = registerValidation(req.body)
    
    if (error) {
        return res.status(400).json(error.details[0])
    }

    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
        return res.status(400).json({ message: messages.userAlreadyExists })
    }
    const hashPassword = bcryptjs.hashSync(password)

    const user = new User({
        email,
        password: hashPassword,
        roles: ['user'],
    })
    await user.save()

    return res.json({ id: user._id })
}

module.exports.login = async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) {
        return res.status(400).json(error.details[0])
    }

    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !bcryptjs.compareSync(password, user.password)) {
        return res.status(403).json({ message: messages.badLogin })
    }

    const accessToken = issueAccessToken(user)
    const refreshToken = issueRefreshToken(user)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    Session.create({ token: refreshToken, user, ip })
    return res.json({ accessToken, refreshToken })
}

module.exports.refresh = async (req, res) => {
    try {
        jwt.verify(req.body.refreshToken, process.env.JWT_SECRET_KEY)
    } catch (e) {
        return res.status(400).json({ message: messages.invalidRefreshToken })
    }

    const session = await Session.findOne({
        token: req.body.refreshToken,
    }).populate('user')

    if (!session?.user) {
        return res.status(404).send()
    }
    
    let deleted = await Session.findByIdAndDelete(session._id).exec()
    if (!deleted) {
        return res.status(400).json({ message: messages.invalidRefreshToken })
    }
    
    const accessToken = issueAccessToken(session.user)
    const refreshToken = issueRefreshToken(session.user)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    Session.create({ token: refreshToken, user: session.user, ip })
    return res.json({ accessToken, refreshToken, deletedId: deleted?._id })
}

module.exports.logout = async (req, res) => {
    await Session.findOneAndDelete({
        token: req.body.refreshToken,
    }).exec()
    return res.status(200).send()
}
