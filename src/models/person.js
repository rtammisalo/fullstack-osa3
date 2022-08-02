const mongoose = require('mongoose')
const process = require('node:process')

const DBUri = process.env.MONGODB_URI

mongoose
  .connect(DBUri)
  .then(() => {
    console.log('Connected to database')
  })
  .catch(error => {
    console.log('Database connection failed:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: num => {
        return /^\d{2,3}-\d{4,}$/.test(num)
      },
      message: input => `${input.value} is not valid (xx[x]-xxxxx...)`
    },
    required: true
  }
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
