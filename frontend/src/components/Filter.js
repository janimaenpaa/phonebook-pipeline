import React from "react";

const Filter = ({ text, value, setFilter }) => {
  const handleFilterChange = event => {
    setFilter(event.target.value);
  };
  return (
    <div>
      {text} <input value={value} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
