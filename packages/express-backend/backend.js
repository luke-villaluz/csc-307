// backend.js
import express from "express";
import cors from "cors";


const app = express();
const port = 8000;

// app functions
app.use(cors());
app.use(express.json());


const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

// find functions
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

// add user function
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

// delete user function
const deleteUserById = (id) => {
  const index = users["users_list"].findIndex(user => user.id === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// get functions
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    // Filter by both name and job
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name !== undefined) {
    // Filter by name only
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    // Return all users if no query parameters are provided
    res.send(users);
  }
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});


// post functions here
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = { id: Math.random().toString(36).substr(2, 9), ...userToAdd };
  console.log('New user created:', newUser);
  addUser(newUser);
  console.log('Updated users list:', users["users_list"]);
  res.status(201).json(newUser);
});

// delete function here
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const userExists = findUserById(id) !== undefined;

  console.log(`Received delete request for user with id: ${id}`);  // Log the ID

  if (userExists) {
    deleteUserById(id);
    res.status(200).send(`User with ID ${id} deleted.`);
  } else {
    res.status(404).send("User not found.");
  }
});