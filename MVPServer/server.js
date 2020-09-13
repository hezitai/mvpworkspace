'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())

const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

const db = require('./app/config/db.config.js');

/*
// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync with { force: true }');
});
*/

/*
// simple route for test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MVP Server." });
});
*/

require('./app/route/system-define.route')(app);
require('./app/route/dataset.route')(app);


// Create a Server
var server = app.listen(8080, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})


