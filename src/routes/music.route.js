const { Router } = require('express')

const {
    getSearchSuggestions,
    search,
    getSongData,
    prepare,
    stream,
    getFile,
} = require('../controllers/music.controller')

const router = Router()

router.post('/getSearchSuggestions', getSearchSuggestions)
router.post('/search', search)
router.get('/id/:id', getSongData)
router.get('/stream/:id', stream)
router.get('/file/:id/:name', getFile)

router.ws('/ws', (ws) => {
    ws.onmessage = function (event) {
        const json = JSON.parse(event.data)
        console.log(json);
        if (json?.event === 'prepare') {
            prepare(json.data, (data) => {
                ws.send(JSON.stringify({event: 'prepare', data}))
            })
        }
    }
})

module.exports = router
