const { Router } = require('express')


const router = Router();

router('/qwe', (req, res) => {
    return res.json('qwe')
})


module.exports = router;


