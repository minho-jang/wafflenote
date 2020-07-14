const express = require('express')
const router = express.Router()

// "/api/slide-recognition"로 연결

router.get('/', (req, res, next) => {
    res.send("Slide Recognition")
})

module.exports = router