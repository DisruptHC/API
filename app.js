var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var book_model = require('./models/book');

var db_username = "DisruptHC";
var db_password = "HenryRutgers";
var db_url = "mongodb://" + db_username + ":" + db_password + "@ds123370.mlab.com:23370/bookgenius";
mongoose.connect(db_url);

var router = express.Router();

router.use(function(req, res, next) {
    // console.log('Make sure that user is authenticated!');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to BookGenius API!'});
});

router.post('/books/add', function(req, res) {
  // *Todo*
  // Should use MIME type: multipart/form-data for larger payload.
  // Currently using: x-www-form-urlencoded
  // Do validation on post data before db actions.
  // *Todo*
    var book_title = req.body.title;
    var book_author = req.body.author;
    var Book = new book_model({
      name: book_title,
      author: book_author
    });
    Book.save()
      .then(function(Book) {
          res.json({message: "'" + book_title + "' by " + book_author + "saved to database.", status_code: 1});
      })
      .catch(function(err) {
          res.json({message: "An error occured: " + err, status_code: 0});
      });
});

app.use('/api', router);

app.listen(port);
console.log('Server Listening on Port: ' + port);
