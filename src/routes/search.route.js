const { Router } = require('express')


const { getSearchSuggestions, search } = require('../controllers/search.controller')

const router = Router();

router.post('/getSearchSuggestions', getSearchSuggestions)
router.post('/search', search)

module.exports = router;


