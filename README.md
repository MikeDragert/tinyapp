# Tiny App

TinyApp is a full stack web application built with Node and express (EJS) that allows users to shorten long URLS.

It provides a way for users to register an account, and add long urls that will then be assigned a random short url, that can then be used as a redirect to the longer url.

Users can only add, edit, delete urls when they are logged in and they can only see or modify the urls that they created.  

Encrypted cookies are used to track the current logged in user.  Passwords are saved in a hash.  Note currently there is no way to recover passwords.

As this was for demonstration purposes, data is kept in memory and reset when the server is restarted.


## Dependencies

- Node.js
- Express
- EJS
- bcrypt.js
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

