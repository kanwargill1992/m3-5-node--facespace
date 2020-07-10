"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
const handleHomePage = (req, res) => {
  res.status(200);
  res.render("pages/homepage", { users });
};
const handleProfilePage = (req, res) => {
  let num = req.params._id;
  let findUser = users.find((user) => user._id === num);

  let friends = findUser.friends.map((friendId) => {
    return users.find((friend) => {
      return friend._id == friendId;
    });
  });

  res.render("pages/profile", { users, user: findUser, friends });
};
const handleSignIn = (req, res) => {
  res.render("pages/signIn");
};
const handleName = (req, res) => {
  let firstName = req.body.firstName;

  let person = users.find(
    (user) => user.name.toLowerCase() === firstName.toLowerCase()
  );

  if (person !== undefined && firstName === person.name) {
    let friends = person.friends.map((friendId) => {
      return users.find((friend) => {
        return friend._id == friendId;
      });
    });
    res.render("pages/profile", { user: person, friends }).status(200);
  } else {
    res.redirect("/signIn").status(404);
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/users/:_id", handleProfilePage)
  .get("/", handleHomePage)
  .get("/signIn", handleSignIn)
  .post("/getName", handleName)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
