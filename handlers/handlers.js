const e = require("express");

const users = {
  "g8Nd6e": {
    id: "g8Nd6e",
    email: "user@example.com",
    password: "purple-monkey"
  },
  "nJDE7z": {
    id: "nJDE7z",
    email: "user2@example.com",
    password: "diswasher-funK"
  },
  "qhrtGE": {
    id: "qhrtGE",
    email: "user3@example.com",
    password: "diswasher-funK"
  }
}

const STRINGLENGTH = 6;
const AVAILABLECHARS = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const generateRandomCharacter = function() {
  const randomIndex = Math.floor((Math.random() * AVAILABLECHARS.length));
  return AVAILABLECHARS[randomIndex];
};

const generateRandomString = function() {
  let returnString = "";
  while (returnString.length < STRINGLENGTH) {
    returnString += generateRandomCharacter();
  }
  return returnString;
};

const generateNewShortUrl = function() {
  let newShortUrl = generateRandomString();
  while (urlDatabase[newShortUrl] !== undefined) {
    newShortUrl = generateRandomString();
  }
  return newShortUrl;
}

const validateUserData = function(userData) {
  if (userData.email && userData.password) {
    if (getUserByEmail(userData.email)){
      return { valid: false, message: "User already exists!"};
    }
    return { valid: true, message: "valid"};
  }
  return { valid: false, message: "Invalid data specified!"};
}

const getUserByEmail = function(email) {
  for(const userKey in users) {
    if (users[userKey].email === email) {      
      return users[userKey];
    }
  }
  return undefined;
}

const generateNewUserId = function() {
  let newUserId = generateRandomString();
  while (users[newUserId] !== undefined) {
    newUserId = generateRandomString();
  }
  return newUserId;
}

const createIdAddUser = function(userData) {
  let { valid, message } = validateUserData(userData);
  if (valid) {
    let userId = generateNewUserId();
    users[userId] = {id: userId,
                     email: userData.email,
                     password: userData.password };
    return {newUser: users[userId], error: undefined};
  } else {
    return {newUser: undefined, error: message}
  }
}

const getUserById = function(id) {
  return users[id];
}

module.exports = { generateRandomString, createIdAddUser, getUserById, getUserByEmail}