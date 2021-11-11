const YoutubeMusicApi = require('youtube-music-api')

const api = new YoutubeMusicApi()
api.initalize().then((info) => {
    info //?

})


module.exports.getSearchSuggestions = async (req, res) => {
    api.getSearchSuggestions(req.body.text).then(result => {
        res.json(result)
	})
}
module.exports.search = async (req, res) => {
    api.search(req.body.text, req.body.type).then(result => {
        res.json(result)
	})
}