const express = require('express');

//Starts express application
const app = express();

//Sets up middleware, incoming requests go through app.use().
app.use((req, res, next) => {
    res.status(200).json({
        message: "Everything is okay."
    });
});

module.exports = app;