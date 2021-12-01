const User = require('../models/User')

module.exports.likeSong = async (req, res) => {
    if (typeof req.body?.id !== 'string' || req.body.id.length > 30) {
        return res.status(400).send()
    }
    await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { likedSongs: req.body.id },
    })
    return res.status(200).send()
}

module.exports.unlikeSong = async (req, res) => {
    const { id: songId } = req.body
    if (typeof songId !== 'string' || songId.length > 30) {
        return res.status(400).send()
    }
    await User.findByIdAndUpdate(req.user.id, {
        $pull: { likedSongs: songId },
    })
    return res.status(200).send()
}

module.exports.setName = async (req, res) => {
    const { name } = req.body
    if (typeof name !== 'string' || name.length > 30) {
        return res.status(400).send()
    }
    await User.findByIdAndUpdate(req.user.id, {
        $set: { name },
    })
    return res.status(200).send()
}