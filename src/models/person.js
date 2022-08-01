const mongoose = require('mongoose')

const DBUri = process.env.MONGODB_URI

mongoose
  .connect(DBUri)
  .then(result => {
    console.log('Connected to database')
  })
  .catch(error => {
    console.log('Database connection failed:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PersonModel = mongoose.model('Person', personSchema)

module.exports = PersonModel
