import React from "react";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  if (message.includes("Added")) {
      return <div className="add">{message}</div>;
  }

  if (message.includes("Number updated")) {
    return <div className="update">{message}</div>;
  }

  return <div className="error">{message}</div>;
};

export default Notification;
