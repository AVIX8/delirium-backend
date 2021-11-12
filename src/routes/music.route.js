const { Router } = require('express');

const { getSearchSuggestions, search, download, get } = require('../controllers/music.controller');

const router = Router();

router.post('/getSearchSuggestions', getSearchSuggestions)
router.post('/search', search)
router.get('/download/:id', download)
router.get('/get/:id', get)

module.exports = router;


