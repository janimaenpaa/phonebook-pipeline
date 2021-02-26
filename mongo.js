const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@phonebook-1wkbl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const Person = mongoose.model("Person", personSchema)

if (personName === null) {
  Person.find({}).then(result => {
    console.log("phonebook:")

    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: personName,
    number: personNumber,
    date: new Date()
  })

  person.save().then(() => {
    console.log(`Added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
}
