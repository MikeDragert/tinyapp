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

// generate one random character
const generateRandomCharacter = function() {
  const randomIndex = Math.floor((Math.random() * AVAILABLECHARS.length));
  return AVAILABLECHARS[randomIndex];
};

// generate a randome string of STRINGLENGTH
const generateRandomString = function() {
  let returnString = "";
  while (returnString.length < STRINGLENGTH) {
    returnString += generateRandomCharacter();
  }
  return returnString;
};

// generate a new short url that is unique
const generateNewShortUrl = function() {
  let newShortUrl = generateRandomString();
  while (urlDatabase[newShortUrl] !== undefined) {
    newShortUrl = generateRandomString();
  }
  return newShortUrl;
};

// user has edit permission
//  execute callback if not
const userHasPermissionToEdit = function(user, callback) {
  if (!user) {
    callback(user, { status: 403, message: "Not authorized to edit urls" });
    return false;
  }
  return true;
};

// is is authorized to edit this specific url
//  execute callback if not
const isCorrectUserToEdit = function(user, shortUrl, callback) {
  if (user.id !== getUrlFromShortUrl(shortUrl).userID) {
    callback(user,  { status: 403, message: "Not correct person to edit this url" });
    return false;
  }
  return true;
};

// return the url data with the shortUrl key
const getUrlFromShortUrl = function(shortUrl) {
  return urlDatabase[shortUrl];
};

// update the url data with the shortUrl key
const updateUrlWithShortUrl = function(shortUrl, urlInfo) {
  urlDatabase[shortUrl] = {longURL: urlInfo.longURL,
    userID: urlInfo.userID};
};

//create a new url for the given long url and user id
// generates a new unique short url key to use
const createNewURL = function(longURL, userID) {
  let newShortUrl = generateNewShortUrl();
  updateUrlWithShortUrl(newShortUrl, {longURL: longURL, userID: userID});
  return newShortUrl;
};

// delete the url data with the shortUrl key
const deleteUrlWithShortUrl = function(shortUrl) {
  delete urlDatabase[shortUrl];
};

// get all url data for the user
const getUserUrls = function(userID) {
  let returnUrls = {};
  for (const urlKey in urlDatabase) {
    if (urlDatabase[urlKey].userID === userID) {
      returnUrls[urlKey] = urlDatabase[urlKey];
    }
  }
  return returnUrls;
};

// return true if the user already has an url with this long url
const userHasLongUrl = function(userID, longUrl) {
  const userUrlList = Object.values(getUserUrls(userID));
  return (userUrlList.some(url => (url.longURL === longUrl)));
};

//validate if a user can use a given longUrl
const isValidLongUrl = function(userID, longUrl) {
  return ((longUrl.length > 0) &&
          (!userHasLongUrl(userID, longUrl)));
};

// validate the given user data is ok to use
const validateUserData = function(userData) {
  if (userData.email && userData.password) {
    if (getUserByEmail(userData.email, users)) {
      return { valid: false, message: "User already exists!"};
    }
    return { valid: true, message: "valid"};
  }
  return { valid: false, message: "Invalid data specified!"};
};

// get user by email
const getUserByEmail = function(email, database) {
  for (const userKey in database) {
    if (database[userKey].email === email) {
      return database[userKey];
    }
  }
  return undefined;
};

// generate a new unique user id
const generateNewUserId = function() {
  let newUserId = generateRandomString();
  while (users[newUserId] !== undefined) {
    newUserId = generateRandomString();
  }
  return newUserId;
};

// attempt to create a new user with the given data
//  if there is an error, call the callback
const createUserWithNewId = function(userData, callback) {
  let { valid, message } = validateUserData(userData);
  if (valid) {
    let userId = generateNewUserId();
    users[userId] = {id: userId,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10) };
    return users[userId];
  } else {
    callback(userData, { status: 400, message: "Invalid user details: " + message });
    return {};
  }
};

//  get user with the given id
const getUserById = function(id, database) {
  return database[id];
};

// lookup and return the user that was specified in the cookie
const getUserFromCookie = function(sessionCookie) {
  const userIdFromCookie = sessionCookie.user_id;
  return getUserById(userIdFromCookie, users);
};

module.exports = {
  users,
  urlDatabase,
  createNewURL,
  userHasPermissionToEdit,
  isCorrectUserToEdit,
  getUrlFromShortUrl,
  updateUrlWithShortUrl,
  deleteUrlWithShortUrl,
  getUserUrls,
  isValidLongUrl,
  createUserWithNewId,
  getUserById,
  getUserByEmail,
  getUserFromCookie };