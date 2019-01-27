require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes
require('./routes/routes.js')(app);

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Start server
app.listen(process.env.PORT);
console.log('Server has successfully started on PORT: ' + process.env.PORT);

// Error handling
app.use(function (req, res, next) {
    var err = new Error('You are trying to access a non-existent route');
    err.status = 404;
    next(err);
});