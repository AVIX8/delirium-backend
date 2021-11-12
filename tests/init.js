const superTest = require('supertest')

const app = require('../src/app')
const { connection } = require('../src/config/database')

const agent = superTest.agent(app)

async function dropAllCollections () {
    const collections = Object.keys(connection.collections)
    for (const collectionName of collections) {
      const collection = connection.collections[collectionName]
      try {
        await collection.drop()
      } catch (error) {
        // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
        // Safe to ignore. 
        if (error.message === 'ns not found') return
  
        // This error happens when you use it.todo.
        // Safe to ignore. 
        if (error.message.includes('a background operation is currently running')) return
  
        console.log(error.message)
      }
    }
  }

beforeAll((done) => {
    connection.once('open', () => {
        setImmediate(done);
    })
})

afterAll(async () => {
    await dropAllCollections()
    await connection.close()
})

module.exports.agent = agent
