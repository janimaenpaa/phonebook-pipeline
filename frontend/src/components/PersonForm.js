import React from "react";

import personService from "../services/persons";

const PersonForm = ({
  newName,
  newNumber,
  persons,
  setPersons,
  setNewName,
  setNewNumber,
  setErrorMessage
}) => {
  const addPerson = event => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    };

    if (persons.find(person => person.name === newName)) {
      const id = persons.filter(person => person.name === newName)[0].id;

      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return updatePerson(id, personObject);
      }
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setErrorMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .catch(error => {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const updatePerson = (id, personObject) => {
    const person = persons.find(per => per.id === id);
    const changedPerson = { ...person, number: personObject.number };

    personService
      .update(id, changedPerson)
      .then(changedPerson => {
        setPersons(
          persons.map(person =>
            person.name === newName ? { ...changedPerson } : person
          )
        );
        setErrorMessage(`Number updated`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .catch(error => {
        setErrorMessage(
          `Information of ${personObject.name} has already been removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setPersons(persons.filter(per => per.id !== id));
      });
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
