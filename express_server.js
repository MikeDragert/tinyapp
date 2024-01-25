const express = require("express");
const cookieParser = require('cookie-parser');
const { generateRandomString,
  checkEditPermissionTrap,
  checkUserMatchPermissionTrap,
  getUrlFromShortUrl,
  setUrlWithShortUrl,
  deleteUrlWithShortUrl,
  getAllUrls,
  getUserUrls,
  createIdAddUser,
  getUserById,
  getUserByEmail } = require('./handlers/handlers');

const { escapeXML } = require("ejs");

const app = express();
app.use(cookieParser());
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));


app.listen(PORT, () => {
  console.log(`Exampleapp listening on port ${PORT}!`);
});

const isValidLongUrl = function(userID, longUrl) {
  return ((longUrl.length > 0) && (!Object.values(getUserUrls(userID)).includes(longUrl)));
};

app.post("/urls", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (checkEditPermissionTrap(user, res)) {
    let newLongUrl =  req.body.longURL;
    if (isValidLongUrl(user.id, newLongUrl)) {
      let newShortUrl = generateRandomString();
      while (getUrlFromShortUrl(newShortUrl) !== undefined) {
        newShortUrl = generateRandomString();
      }
      setUrlWithShortUrl(newShortUrl, {longURL: newLongUrl, userID: user.id});
    }
    res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const userID = user ? user.id : "";
  const templateVars = { user: user,
                         urls: getUserUrls(userID) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req,res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (!user) {
    res.redirect("/login");
  } else {
    const templateVars = { user: user };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const invalidUrl = (getUrlFromShortUrl(id) === undefined);
  if (invalidUrl) {
    const templateVars = { user: user,
                           error: "The specified url " + id + " does not exist"};
    res.status(404).render("urls_Error", templateVars);
  } else {
    const templateVars = { user: user,
                          id,
                          longURL: getUrlFromShortUrl(req.params.id).longURL};
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  let longUrl = "/urls/" + req.params.id;
  res.redirect(longUrl);
});

app.post("/urls/:id/delete", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (checkEditPermissionTrap(user, res)) {
    if (checkUserMatchPermissionTrap(user, req.params.id, res)) {
      deleteUrlWithShortUrl(req.params.id);
      res.redirect("/urls");
    }
  }
});

app.post("/urls/:id/update", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (checkEditPermissionTrap(user, res)) {
    if (checkUserMatchPermissionTrap(user, req.params.id, res)) {
      let newLongUrl = req.body.longURL;
      if (isValidLongUrl(user.id, newLongUrl)) {
        setUrlWithShortUrl(req.params.id, {longURL: req.body.longURL, userID: user.id});
      }
      res.redirect("/urls");
    }
  }
});

app.get("/login", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (user) {
    res.redirect("/urls");
  }
  const templateVars = { user: user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  let userData = req.body;
  let user = getUserByEmail(userData.email);
  if ((!user) || (user.password !== userData.password)) {
    const templateVars = { user: user,
                            error: "Invalid login credentials"};
    res.status(403).render("urls_Error", templateVars);
  } else {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  if (user) {
    res.redirect("/urls");
  }
  const templateVars = { user: user };
  res.render("register",templateVars);
});

app.post("/register", (req, res) => {
  let userData = req.body;
  let { newUser, error} = createIdAddUser(userData);
  if (error) {
    const templateVars = { user: undefined,
                          error: "Invalid user details: " + error};
    res.status(400).render("urls_Error", templateVars);
  } else {
    res.cookie("user_id", newUser.id);
    res.redirect("/urls");
  }
});

app.get("/hello", (req, res) => {
  const userIdFromCookie = req.cookies["user_id"];
  const user = getUserById(userIdFromCookie);
  const templateVars = {user: user,
                        greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});