var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Make sure that user is authenticated!');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to BookGenius!' });
});

app.use('/api', router);

app.listen(port);
console.log('Server Listening on Port: ' + port);
