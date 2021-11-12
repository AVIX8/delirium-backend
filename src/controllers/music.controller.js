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

// const getImageUrl = (thumbnails, size = 120) => {
//     const url = thumbnails[0].url
//     return `${url.split('=')[0]}=w${size}-h${size}-l90-rj`
// }

module.exports.search = async (req, res) => {
    await apiInit
    api.search(req.body.text, req.body.type || 'song').then((result) => {
        res.json(result.content)
    })
}

function syncStdoutProgress(text, appendNewline = false) {
    process.stdout.cursorTo(0)
    process.stdout.clearLine(1)
    process.stdout.write(text)

    if (appendNewline) {
        process.stdout.write('\n')
    }
}

const outputPath = path.join(process.cwd(), 'songs')
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {
        recursive: true,
    })
}

const getPath = (id) => path.join(outputPath, `${id}.mp4`)

module.exports.download = async (req, res) => {
    if (typeof req.params.id != 'string' || req.params.id.length > 30)
        return res.status(400)

    const mp4OutputPath = getPath(req.params.id)
    if (fs.existsSync(mp4OutputPath)) {
        return res.end()
    }

    const url = `https://www.youtube.com/watch?v=${req.params.id}`
    const track = ytdl(url, { filter: 'audioonly' })

    track.pipe(fs.createWriteStream(mp4OutputPath))

    track
        .on('progress', (chunkLength, downloaded, total) => {
            const val = `${((downloaded / total) * 100).toFixed(2)}% `
            res.write(val)
            syncStdoutProgress('Downloading:' + val)
        })
        .on('end', async () => {
            console.log(mp4OutputPath)
            res.end()
        })
        .on('error', (err) => {
            console.log(err)
            res.status(400).send(err).end()
        })
}

module.exports.get = async (req, res) => {
    if (typeof req.params.id != 'string' || req.params.id.length > 30)
        return res.status(400)

    const mp4OutputPath = getPath(req.params.id)
    return ms.pipe(req, res, mp4OutputPath)
}
