import React from "react";

const Persons = ({ filter, persons, deletePerson }) => {
  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );
  return (
    <div>
      {personsToShow.map((person, i) => (
        <p key={i}>
          {`${person.name} ${person.number}`} <button onClick={() => deletePerson(person)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
