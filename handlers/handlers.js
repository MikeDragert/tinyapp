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
  //todo:  make sure not blank
  //todo:  make sure it doesn't already exists!
  return (userData.email && userData.password);
}

const generateNewUserId = function() {
  let newUserId = generateRandomString();
  while (users[newUserId] !== undefined) {
    newUserId = generateRandomString();
  }
  return newUserId;
}

const createIdAddUser = function(userData) {
  let userId;
  if (validateUserData(userData)) {
    userId = generateNewUserId();
    users[userId] = {id: userId,
                     email: userData.email,
                     password: userData.password };
  }
  return users[userId];
}

const getUserById = function(id) {
  //todo, check that not blank
  //    what to do if error
  return users[id];
}

module.exports = { generateRandomString, createIdAddUser, getUserById}