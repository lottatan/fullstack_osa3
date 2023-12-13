const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

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


app.use(express.json())
morgan.token('body', (req) => {
    return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
  

const generateId = () => {
    let randomId
    do {randomId = Math.floor(Math.random() * 100) + 1}
    while (persons.some(person => person.id === randomId))
    return randomId} 

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)} 
    else {
        res.status(404).send('Person not found')}})

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
    
    else if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'})}

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()}

    persons = persons.concat(person)
    res.json(person)}) 

      

app.get('/info', (req, res) => {
    res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toLocaleString()}</p>`)})

app.use(unknownEndpoint)
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})