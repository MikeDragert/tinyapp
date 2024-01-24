const express = require("express");
const cookieParser = require('cookie-parser');
const {generateRandomString, createIdAddUser, getUserById} = require('./handlers/handlers');

const app = express();
app.use(cookieParser());
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.listen(PORT, () => {
  console.log(`Exampleapp listening on port ${PORT}!`);
});

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
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const templateVars = { user: user,
                         urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const invalidUrl = (urlDatabase[id] === undefined);
  if (invalidUrl) {
    res.status = 404;
    const templateVars = { user: user,
                          id};
    res.render("urls_notFound", templateVars);
  }
  const templateVars = { user: user,
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
  //todo:  going to have to come back to this...
  //       check if the useremail exists, 
  //       check if the password is right
  //       then login if ok
  // if ((usernameFromBody) && (usernameFromBody.length > 0)) {
  //   res.cookie("username", usernameFromBody);
  // }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { user: undefined };
  res.render("register",templateVars);
});

app.post("/register", (req, res) => {
  let userData = req.body;
  //todo:  need to check status here
  let newUser = createIdAddUser(userData);
  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  let id = req.params.id;
  const user = getUserById(userIdFromCookie);
  const templateVars = {user: user,
                        greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});