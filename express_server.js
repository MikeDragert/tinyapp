const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");

const {
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
  getUserFromCookie } = require('./handlers/helpers');

const { escapeXML } = require("ejs");

const app = express();
app.use(cookieSession(
  {
    name: 'session',
    keys: ['keyABC', 'keyDEF','keyXYZ']
  }
));
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// will render an error page with specified error message
const renderError = function(res, user, error) {
  const templateVars = { user: user,
                         error: error.message};
  res.status(error.status).render("urls_Error", templateVars);
};

// redirect appropiately if not given a url
app.get("/", (req, res) => {
  const userIdFromCookie = req.session.user_id;
  const user = getUserById(userIdFromCookie, users);
  if (!user) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

// show url list for user
app.get("/urls", (req, res) => {
  const user = getUserFromCookie(req.session);
  const userID = user ? user.id : "";
  const templateVars = { user: user,
                         urls: getUserUrls(userID) };
  res.render("urls_index", templateVars);
});

// update url list for user by adding submitted url info
app.post("/urls", (req, res) => {
  const user = getUserFromCookie(req.session);;
  if (userHasPermissionToEdit(user, (user, error) => {
      renderError(res, user, error);
    })) {
    let newLongUrl =  req.body.longURL;
    if (isValidLongUrl(user.id, newLongUrl)) {
      createNewURL(newLongUrl, user.id);
      res.redirect("/urls/" + newShortUrl);
    } else {
      res.redirect("/urls");
    }
  }
});

// show a page for getting new url information
app.get("/urls/new", (req,res) => {
  const user = getUserFromCookie(req.session);
  if (!user) {
    res.redirect("/login");
  } else {
    const templateVars = { user: user };
    res.render("urls_new", templateVars);
  }
});

// show a page for editing one specified url
app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  const user = getUserFromCookie(req.session);
  const invalidUrl = (getUrlFromShortUrl(id) === undefined);
  if (invalidUrl) {
    renderError(res, user, { status: 404, message: "The specified url " + id + " does not exist"});
  } else {
    if (userHasPermissionToEdit(user, (user, error) => {
        renderError(res, user, error);
      })) {
      if (isCorrectUserToEdit(user, req.params.id, (user, error) => {
          renderError(res, user, error);
        })) {
        const templateVars = { user: user,
                              id,
                              longURL: getUrlFromShortUrl(req.params.id).longURL};
        res.render("urls_show", templateVars);
      }
    }
  }
});

// redirect short url to saved long url
app.get("/u/:id", (req, res) => {
  const url = getUrlFromShortUrl(req.params.id);
  if ((url) && (url.longURL)) {
    res.redirect(url.longURL);
  } else {
    res.redirect("/urls");
  }
});

// delete a given url
app.post("/urls/:id/delete", (req, res) => {
  const user = getUserFromCookie(req.session);
  if (userHasPermissionToEdit(user, (user, error) => {
      renderError(res, user, error);
    })) {
    if (isCorrectUserToEdit(user, req.params.id, (user, error) => {
        renderError(res, user, error);
      })) {
      deleteUrlWithShortUrl(req.params.id);
      res.redirect("/urls");
    }
  }
});

// update a given url
app.post("/urls/:id/update", (req, res) => {
  const user = getUserFromCookie(req.session);
  if (userHasPermissionToEdit(user, (user, error) => {
      renderError(res, user, error);
    })) {
    if (isCorrectUserToEdit(user, req.params.id, (user, error) => {
        renderError(res, user, error);
      })) {
      let newLongUrl = req.body.longURL;
      if (isValidLongUrl(user.id, newLongUrl)) {
        updateUrlWithShortUrl(req.params.id, {longURL: req.body.longURL, userID: user.id});
      }
      res.redirect("/urls");
    }
  }
});

// present login page
app.get("/login", (req, res) => {
  const user = getUserFromCookie(req.session);
  if (user) {
    res.redirect("/urls");
  }
  const templateVars = { user: user };
  res.render("login", templateVars);
});

// handle login request
app.post("/login", (req, res) => {
  let userData = req.body;
  let user = getUserByEmail(userData.email, users);
  if ((!user) || (!bcrypt.compareSync(userData.password, user.password))) {
    renderError(res, undefined, { status: 403, message: "Invalid login credentials" });
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

// handle logout request
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// present a user registration page
app.get("/register", (req, res) => {
  const user = getUserFromCookie(req.session);
  if (user) {
    res.redirect("/urls");
  }
  const templateVars = { user: user };
  res.render("register",templateVars);
});

// handle user registration
app.post("/register", (req, res) => {
  let userData = req.body;
  let newUser = createUserWithNewId(userData,  (user, error) => {
    renderError(res, user, error);
  });
  if (newUser) {
    req.session.user_id = newUser.id;
    res.redirect("/urls");
  }
});

// basic hello world
app.get("/hello", (req, res) => {
  const user = getUserFromCookie(req.session);
  const templateVars = {user: user,
                        greeting: "Hello World!"};
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Exampleapp listening on port ${PORT}!`);
});