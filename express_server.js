const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const STRINGLENGTH = 6;
const AVAILABLECHARS = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";


// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

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


// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
app.post("/urls", (req, res) => {
  console.log(req.body);
  //todo:  should check that the random short url is not already in list.
  //todo:  may want to check that the given long url is not already in list too!
  let newShortUrl = generateRandomString();

  console.log(newShortUrl);
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect("/u/" + newShortUrl);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  const invalidUrl = (urlDatabase[id] === undefined);
  if (invalidUrl) {
    res.status = 404;
    const templateVars = {id};
    res.render("urls_notFound", templateVars);
  }
  const templateVars = { id: id, longURL: urlDatabase[req.params.id]};
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
  if (newLongUrl.length > 0) {
    urlDatabase[req.params.id] = req.body.longURL;
  }
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let username = req.body.loginusername;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  const templateVars = {greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});