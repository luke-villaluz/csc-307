// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    }).then((res) => {
      // Check if the status is 201 before resolving the promise
      if (res.status === 201) {
        // res.json() returns another promise
        return res.json(); // Return the response JSON if it's a success
      } else {
        // Reject the promise by throwing an error
        throw new Error("Failed to create user"); // Throw an error if the status is not 201
      }
    });
  }

  function updateList(person) {
    postUser(person)
      .then((newUser) => {
        console.log('New user added:', newUser);
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    console.log('Deleting user with id:', id);  // Log the id to check if it's correctly passed
    
    // Send a DELETE request to the backend to delete the user by ID
    fetch(`http://localhost:8000/users/${id}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`User with id ${id} deleted successfully`);
          // If successful, update the frontend state to remove the user by ID
          const updated = characters.filter((character) => character.id !== id);
          setCharacters(updated);
        } else {
          console.log(`Failed to delete: received status ${res.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;