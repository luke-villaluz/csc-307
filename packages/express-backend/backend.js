// backend.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

// app functions
app.use(cors());
app.use(express.json());

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

  userService.getUsers(name,job)
    .then((users) => {
      res.json({users_list: users})
    })
    .catch((error) => {
      res.status(500).send("Error fetching users from database");
      console.log(error);
    });
});



// post function
app.post("/users", (req, res) => {
  const user = req.body;
  
  userService.addUser(user)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).send("Error adding user to the database");
      console.log(error);
    });
});



// delete function
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  
  userService.findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      }
      return userService.deleteUserById(id)
      .then(() => {
        res.status(200).send("User with id ${id} deleted");
      })
      .catch((error) => {
        res.status(500).send("Error deleting user");
        console.log(error);
      });
    });
});