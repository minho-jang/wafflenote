const express = require('express')
const app = express()

// 정적 파일 설정
app.use('/static', express.static(__dirname + '/public'));

// 라우팅 설정
app.use('/api', require("./api/index"))

app.listen(3000, function() {
    console.log("Server start on port 3000...")
})
