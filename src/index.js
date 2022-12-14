require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')
const process = require('node:process')

const app = express()

app.use(cors({ crossorigin: true })) // Add crossorigin for frontend access to error.response
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('post-data', (req) => JSON.stringify(req.body))
app.use(morgan(':post-data', { skip: (req) => req.method !== 'POST' }))

app.get('/info', (req, res) => {
  PersonModel
    .find({})
    .then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people </p>`
        + `<p>${Date()}</p>`)
    })
})

app.get('/api/persons', (req, res) => {
  PersonModel
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  PersonModel
    .findById(req.params.id)
    .then(person => {
      if (person) {
        return res.json(person)
      } else {
        return res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PersonModel
    .findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
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
        .catch(error => next(error))
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    number: req.body.number
  }

  PersonModel
    .findByIdAndUpdate(req.params.id, person, {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send('unknown')
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('ErrorHandler:', error.message)

  switch (error.name) {
    case 'CastError':
      return response.status(400).send('malformed input')
    case 'ValidationError':
      return response.status(400).json(error.message)
  }

  next(error)
}

app.use(errorHandler)

const SERVER_PORT = process.env.PORT || 3001
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`)
})
