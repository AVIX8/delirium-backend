const YoutubeMusicApi = require('youtube-music-api')

const api = new YoutubeMusicApi()
const apiInit = api.initalize()


module.exports.getSearchSuggestions = async (req, res) => {
    await apiInit
    api.getSearchSuggestions(req.body.text).then(result => {
        res.json(result)
	})
}

// const getImageUrl = (thumbnails, size = 120) => {
//     const url = thumbnails[0].url
//     return `${url.split('=')[0]}=w${size}-h${size}-l90-rj`
// }

module.exports.search = async (req, res) => {
    await apiInit
    api.search(req.body.text, req.body.type || 'song').then(result => {
        res.json(result.content)
	})
}