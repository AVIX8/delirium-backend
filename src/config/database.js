var mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let connection = mongoose.createConnection()

async function getMongoURI() {
    if (process.env.NODE_ENV !== 'test') {
        return process.env.MONGO_URI
    }

    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongoServer = await MongoMemoryServer.create()
    return mongoServer.getUri('test')
}

(async () => {
    let mongoURI = await getMongoURI() //?

    connection.openUri(
        mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) {
                console.log('📛 Failed to connect to database')
                console.error(err)
            } else {
                console.log('👏 Conected to database')
            }
        }
    )
})()

module.exports.connection = connection
