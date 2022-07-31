const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
morgan.token('post-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':post-data', { skip: (req, res) => req.method !== 'POST' }))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id === Number(req.params.id))

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id !== Number(req.params.id))
  res.status(204).end()
})

const generateNewId = () => {
  return Math.floor(100000000 * Math.random())
}

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'missing name' })
  }
  if (!req.body.number) {
    return res.status(400).json({ error: 'missing number' })
  }
  if (persons.find(person => person.name === req.body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: generateNewId(),
    name: req.body.name,
    number: req.body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people </p>`
    + `<p>${Date()}</p>`)
})



const SERVER_PORT = 3001
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`)
})
