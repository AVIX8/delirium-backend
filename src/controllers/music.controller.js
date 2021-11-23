const path = require('path')
const fs = require('fs')
const ytdl = require('ytdl-core')
const ms = require('mediaserver')

const YoutubeMusicApi = require('youtube-music-api')
const api = new YoutubeMusicApi()
const apiInit = api.initalize()

module.exports.getSearchSuggestions = async (req, res) => {
    await apiInit
    api.getSearchSuggestions(req.body.text).then((result) => {
        res.json(result)
    })
}

module.exports.search = async (req, res) => {
    await apiInit
    api.search(req.body.text, req.body.type || 'song').then((result) => {
        res.json(result.content)
    })
}

module.exports.getSongData = async (req, res) => {
    await apiInit
    api.search(req.params.id, 'song').then((result) => {
        res.json(result.content[0] || {})
    })
}

const outputPath = path.join(process.cwd(), 'songs')
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {
        recursive: true,
    })
}

const getPath = (id) => path.join(outputPath, `${id}.mp4`)

const preparingSongs = {}
module.exports.prepare = async (req, res) => {
    const songId = req.params.id
    if (typeof songId != 'string' || songId.length > 30)
        return res.status(400)

    const mp4OutputPath = getPath(req.params.id)
    if (!(songId in preparingSongs)) {
        if (fs.existsSync(mp4OutputPath)) {
            return res.end()
        }
        const url = `https://www.youtube.com/watch?v=${songId}`
        preparingSongs[songId] = ytdl(url, { filter: 'audioonly' })
        preparingSongs[songId].pipe(fs.createWriteStream(mp4OutputPath))
    }
    
    preparingSongs[songId]
        .on('progress', (chunkLength, downloaded, total) => {
            const val = String(downloaded / total)
            res.write(val)
        })
        .on('end', async () => {
            console.log(mp4OutputPath)
            res.end()
            delete preparingSongs[songId]
        })
        .on('error', (err) => {
            console.log(err)
            res.status(400).send(err).end()
        })
}

module.exports.stream = async (req, res) => {
    if (typeof req.params.id != 'string' || req.params.id.length > 30)
        return res.status(400)

    const mp4OutputPath = getPath(req.params.id)
    if (!fs.existsSync(mp4OutputPath)) {
        return res.status(404);
    }
    
    return ms.pipe(req, res, mp4OutputPath)
}


module.exports.getFile = async (req, res) => {
    if (typeof req.params.id != 'string' || req.params.id.length > 30) {
        return res.status(400)
    }

    const mp4OutputPath = getPath(req.params.id)
    if (!fs.existsSync(mp4OutputPath)) {
        return res.status(404);
    }

    return res.sendFile(mp4OutputPath)
}
