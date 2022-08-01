require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')

const app = express()

app.use(cors({ crossorigin: true }))
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('post-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':post-data', { skip: (req, res) => req.method !== 'POST' }))

app.get('/api/persons', (req, res) => {
  PersonModel
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
  PersonModel
    .findById(req.params.id)
    .then(person => {
      if (person) {
        return res.json(person)
      }
      throw 'Missing person'
    })
    .catch(error => {
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  PersonModel
    .deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.deletedCount == 1) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json('missing name')
  }
  if (!req.body.number) {
    return res.status(400).json('missing number')
  }

  PersonModel
    .findOne({ name: req.body.name })
    .then(result => {
      if (result) {
        return res.status(400).json('name must be unique')
      }

      const person = new PersonModel({
        name: req.body.name,
        number: req.body.number
      })

      person
        .save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
    })
})

app.get('/info', (req, res) => {
  PersonModel
    .find({})
    .then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people </p>`
        + `<p>${Date()}</p>`)
    })
})

const SERVER_PORT = process.env.PORT || 3001
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`)
})
