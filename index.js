const express = require('express')
const app = express()
require('dotenv').config()
const Contact = require('./models/contact')

var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postData', function (req, res) { 
    if(req.method.toLowerCase() === "post"){
        return JSON.stringify(req.body)
    }
    return ""
})


app.use(morgan(':method :url :response-time :postData'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {

    const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()} people</p>`
    response.send(info)
  })
  

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Contact({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// function getRandomId(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }
  
// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name || !body.number) {
//       return response.status(400).json({ 
//         error: 'content missing' 
//       })
//     }
//     const person = persons.find(person =>  person.name === body.name) 
//     if(person){
//         return response.status(400).json({ 
//           error: 'name must be unique' 
//         })

//     }

//     const newPerson = {
//         name: body.name,
//         number: body.number,
//         id: getRandomId(1000),
//     }

//     persons = persons.concat(newPerson)

//   response.json(newPerson)
// })


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})