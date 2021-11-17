const { Router } = require('express');

const { getSearchSuggestions, search, getSongData, download, stream, getFile } = require('../controllers/music.controller');

const router = Router();

router.post('/getSearchSuggestions', getSearchSuggestions)
router.post('/search', search)
router.get('/id/:id', getSongData)
router.get('/download/:id', download)
router.get('/stream/:id', stream)
router.get('/file/:id', getFile)

module.exports = router;


