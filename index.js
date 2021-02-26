require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

const Person = require("./models/person")

app.use(express.static("build"))
app.use(express.json())
app.use(cors())

morgan.token("body", (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.get("/", (_req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/info", (_req, res) => {
  Person.countDocuments({}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(`<div>
                <p>Phonebook has info of ${result} people</p>
                <p>${new Date(Date.now())}</p>
                </div>`)
    }
  })
})

app.get("/api/persons", (_req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: "name missing" })
  } else if (!body.number) {
    return res.status(400).json({ error: "number missing" })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
