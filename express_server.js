const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const STRINGLENGTH = 6;
const AVAILABLECHARS = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

app.listen(PORT, () => {
  console.log(`Exampleapp listening on port ${PORT}!`);
});

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

const isValidLongUrl = function(longUrl) {
  return ((longUrl.length > 0) && (!Object.values(urlDatabase).includes(longUrl)));
};

app.post("/urls", (req, res) => {
  let newLongUrl =  req.body.longURL;
  if (isValidLongUrl(newLongUrl)) {
    let newShortUrl = generateRandomString();
    while (urlDatabase[newShortUrl] !== undefined) {
      newShortUrl = generateRandomString();
    }
    urlDatabase[newShortUrl] = newLongUrl;
  }
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const usernameFromCookie = req.cookies["username"];
  const templateVars = { username: usernameFromCookie,
                         urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  let usernameFromCookie = req.body.username;
  const templateVars = { username: usernameFromCookie };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  const usernameFromCookie = req.cookies["username"];
  const invalidUrl = (urlDatabase[id] === undefined);
  if (invalidUrl) {
    res.status = 404;
    const templateVars = {username: usernameFromCookie,
                          id};
    res.render("urls_notFound", templateVars);
  }
  const templateVars = { username: usernameFromCookie,
                         id,
                         longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  let longUrl = "/urls/" + req.params.id;
  res.redirect(longUrl);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let newLongUrl = req.body.longURL;
  if (isValidLongUrl(newLongUrl)) {
    urlDatabase[req.params.id] = req.body.longURL;
  }
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let usernameFromBody = req.body.username;
  if ((usernameFromBody) && (usernameFromBody.length > 0)) {
    res.cookie("username", usernameFromBody);
  }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  const usernameFromCookie = req.cookies["username"];
  const templateVars = {username: usernameFromCookie,
                        greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});