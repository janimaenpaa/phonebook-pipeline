import React, { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.remove(person.id).then(removedPerson => {
        setPersons(persons.filter(per => per.id !== person.id));
      });
      setErrorMessage(`${person.name} deleted`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter text="filter shown with" value={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        persons={persons}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setErrorMessage={setErrorMessage}
      />
      <h3>Numbers</h3>
      <Persons filter={filter} persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
