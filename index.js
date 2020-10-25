require('dotenv').config()

const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

morgan.token('postData', function (req, res) { 
    if(req.method.toLowerCase() === "post"){
        return JSON.stringify(req.body)
    }
    return ""
})


app.use(morgan(':method :url :response-time :postData'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {

    const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()} people</p>`
    response.send(info)
  })
  

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons)
  })
})


// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person =>  person.id === id) 
//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
// })
app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })


app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    // .catch(error => next(error))
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})