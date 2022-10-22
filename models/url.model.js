const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortUrlSchema = new Schema({
    url:{
        type: String,
        require: true,
    },
    shortId: {
        type: String,
        required: true
    }
})

const shortUrl = mongoose.model('shortUrl',ShortUrlSchema)
module.exports = shortUrl