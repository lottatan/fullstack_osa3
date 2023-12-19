require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
      
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })}  
    next(error)}

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3, 
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
] 

app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
    return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))
  

const generateId = () => {
    let randomId
    do {randomId = Math.floor(Math.random() * 100) + 1}
    while (persons.some(person => person.id === randomId))
    return randomId} 

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')})
  
app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then(persons => {
        res.json(persons)})
    .catch(error => next(error))})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person){
            res.json(person)}
        else {
        res.status(404).send('Person not found')}})
    .catch(error => next(error))})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number}

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedNumber => {
        res.json(updatedNumber)})
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(()=> {
        res.status(204).end()})
    .catch(error => next(error))
    })

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'})}

    else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'})}

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {
        res.json(savedPerson)})
    .catch(error => next(error))
    })
      

app.get('/info', (req, res) => {
    res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toLocaleString()}</p>`)})

app.use(unknownEndpoint)
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })