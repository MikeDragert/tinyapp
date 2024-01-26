const e = require("express");
const bcrypt = require("bcrypt");

const users = {
  "g8Nd6e": {
    id: "g8Nd6e",
    email: "user@example.com",
    password: bcrypt.hashSync("monkey", 10)
  },
  "nJDE7z": {
    id: "nJDE7z",
    email: "user2@example.com",
    password: bcrypt.hashSync("funk", 10)
  },
  "qhrtGE": {
    id: "qhrtGE",
    email: "user3@example.com",
    password: bcrypt.hashSync("dig", 10)
  }
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "g8Nd6e"
  },
  "qhrtGE": {
    longURL: "http://www.google.com",
    userID: "qhrtGE"
  }
};

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
};

const userHasPermissionToEdit = function(user, callback) {
  if (!user) {
    callback(user, { status: 403, message: "Not authorized to edit urls" });
    return false;
  }
  return true;
};

const isCorrectUserToEdit = function(user, shortUrl, callback) {
  if (user.id !== getUrlFromShortUrl(shortUrl).userID) {
    callback(user,  { status: 403, message: "Not correct person to edit this url" });
    return false;
  }
  return true;
};

const getUrlFromShortUrl = function(shortUrl) {
  return urlDatabase[shortUrl];
};

const setUrlWithShortUrl = function(shortUrl, urlInfo) {
  urlDatabase[shortUrl] = {longURL: urlInfo.longURL,
    userID: urlInfo.userID};
};

const deleteUrlWithShortUrl = function(shortUrl) {
  delete urlDatabase[shortUrl];
};

const getAllUrls = function() {
  return urlDatabase;
};

const getUserUrls = function(userID) {
  let returnUrls = {};
  for (const urlKey in urlDatabase) {
    if (urlDatabase[urlKey].userID === userID) {
      returnUrls[urlKey] = urlDatabase[urlKey];
    }
  }
  return returnUrls;
};

const validateUserData = function(userData) {
  if (userData.email && userData.password) {
    if (getUserByEmail(userData.email)) {
      return { valid: false, message: "User already exists!"};
    }
    return { valid: true, message: "valid"};
  }
  return { valid: false, message: "Invalid data specified!"};
};

const getUserByEmail = function(email, database) {
  for (const userKey in database) {
    if (database[userKey].email === email) {
      return database[userKey];
    }
  }
  return undefined;
};

const generateNewUserId = function() {
  let newUserId = generateRandomString();
  while (users[newUserId] !== undefined) {
    newUserId = generateRandomString();
  }
  return newUserId;
};

const createIdAddUser = function(userData) {
  let { valid, message } = validateUserData(userData);
  if (valid) {
    let userId = generateNewUserId();
    users[userId] = {id: userId,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10) };
    return {newUser: users[userId], error: undefined};
  } else {
    return {newUser: undefined, error: message};
  }
};

const getUserById = function(id, database) {
  return database[id];
};

module.exports = {
  users,
  urlDatabase,
  generateRandomString,
  userHasPermissionToEdit,
  isCorrectUserToEdit,
  getUrlFromShortUrl,
  setUrlWithShortUrl,
  deleteUrlWithShortUrl,
  getAllUrls,
  getUserUrls,
  createIdAddUser,
  getUserById,
  getUserByEmail };