const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const novel = require('./routes/novel')
const chapter = require('./routes/chapter')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/images', express.static('public/upload/images'));

app.use('/novel', novel)
app.use('/chapter', chapter)

app.listen(3004, () => {
    console.log('Server is running on port 3004.')
})