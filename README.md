# Tiny App

This web application created using node, express, and ejs provides a way for users to register an account, and add long urls that will then be assigned a random short url, that can then be used as a redirect to the longer url.

Users can only add, edit, delete urls when they are logged in and they can only see or modify the urls that they created.  

Encrypted cookies are used to track the current logged in user.  Passwords are saved in a hash.  Note currently there is no way to recover passwords.

As this was for demonstration purposes, data is kept in memory and reset when the server is restarted.

