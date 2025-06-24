require('dotenv').config()
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const option = {
    socketTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Nếu dùng Atlas, lấy DB_URI trực tiếp từ .env
let dbURI = process.env.DB_URI

console.log(`dbURI=${dbURI}`)

mongoose.connect(dbURI, option)

mongoose.connection.on('error', function (err) {
    if (err) {
        console.log("MongoDB connection error:", err.message)
        throw err
    }
})

module.exports = {
    mongoose,
    models: {
        Users: require('./schemas/users'),
        Message: require('./schemas/message')
    }
}
