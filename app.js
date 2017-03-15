var port = 8080;
var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static content at virtual fs paths
app.use('/angular', express.static(path.join(__dirname, '/node_modules/angular')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Connect to database
var db_username = "DisruptHC";
var db_password = "HenryRutgers";
var db_url = "mongodb://" + db_username + ":" + db_password + "@ds123370.mlab.com:23370/bookgenius";
mongoose.connect(db_url);

// Express routes defined in external file
var routes = require('./routes/routes');

// Set root path
app.use('/', routes);

app.listen(port);
console.log('Server listening on port ' + port);
