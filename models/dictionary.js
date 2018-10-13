const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Translation = mongoose.model('Translation', {
  letter: String,
  code: String
})

module.exports = Translation
