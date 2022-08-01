const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Argument, DB password, is missing')
  process.exit(1)
}

const DBPassword = process.argv[2]
const DBUrl =
  `mongodb+srv://phonebook:${DBPassword}@cluster0.olekd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(DBUrl)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const PersonModel = mongoose.model('Person', personSchema)

const getAll = () => {
  console.log('phonebook:')
  PersonModel
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

const addPerson = () => {
  let name = process.argv[3]
  let number = process.argv[4]
  let person = new PersonModel({ name: name, number: number })

  person
    .save()
    .then(result => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

if (process.argv.length == 3) {
  getAll()
} else if (process.argv.length == 5) {
  addPerson()
}
