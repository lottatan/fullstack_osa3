require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })}

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
  
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person){
            res.json(person)}
        else {
        res.status(404).send('Person not found')}
    })})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()})

app.post('/api/persons', (req, res) => {
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

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })})
      

app.get('/info', (req, res) => {
    res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toLocaleString()}</p>`)})

app.use(unknownEndpoint)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })