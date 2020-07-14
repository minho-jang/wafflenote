const express = require('express')
const router = express.Router()

router.use('/slide-recognition', require('./imageProcessing/slideRecognition'))

router.get('/', (req, res, next) => {
    res.send("<h1>Hello api index page !</h1>")
})

module.exports = router